import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    const data = await res.json();

    if (!res.ok || !data?.status) {
      return NextResponse.json(
        { error: data?.message || "Verification failed", paid: false },
        { status: 400 }
      );
    }

    const tx = data.data;
    const paid = tx.status === "success";

    const payment = await prisma.payment.findFirst({
      where: { transactionId: reference },
      include: { order: true },
    });

    if (payment && paid) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID" },
      });
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });

      const items = await prisma.orderItem.findMany({
        where: { orderId: payment.orderId },
      });
      for (const item of items) {
        if (item.productId) {
          await prisma.product
            .update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
            .catch(() => {});
        }
      }
    } else if (payment && !paid) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "FAILED" },
      });
    }

    return NextResponse.json({
      paid,
      status: tx.status,
      amount: (tx.amount || 0) / 100,
      currency: tx.currency || "NGN",
      reference: tx.reference,
      orderNumber: payment?.order?.orderNumber || null,
      gateway_response: tx.gateway_response,
    });
  } catch (e: unknown) {
    console.error("Verify error:", e);
    const msg = e instanceof Error ? e.message : "Verify failed";
    return NextResponse.json({ error: msg, paid: false }, { status: 500 });
  }
}
