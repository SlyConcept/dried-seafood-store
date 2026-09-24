import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";
    const hash = createHmac("sha512", secret).update(body).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    if (event.event === "charge.success") {
      const reference = event.data?.reference as string;
      if (reference) {
        const payment = await prisma.payment.findFirst({
          where: { transactionId: reference },
        });
        if (payment && payment.status !== "PAID") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "PAID" },
          });
          await prisma.order.update({
            where: { id: payment.orderId },
            data: { paymentStatus: "PAID", status: "CONFIRMED" },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
