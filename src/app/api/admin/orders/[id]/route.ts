import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
] as const;

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: {
    status?: (typeof ORDER_STATUSES)[number];
    paymentStatus?: (typeof PAYMENT_STATUSES)[number];
    adminNotes?: string;
  } = {};

  if (body.status && (ORDER_STATUSES as readonly string[]).includes(body.status)) {
    data.status = body.status;
  }
  if (body.paymentStatus && (PAYMENT_STATUSES as readonly string[]).includes(body.paymentStatus)) {
    data.paymentStatus = body.paymentStatus;
  }
  if (typeof body.adminNotes === "string") {
    data.adminNotes = body.adminNotes;
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data,
    });

    if (data.status === "CONFIRMED" || data.status === "COMPLETED") {
      const items = await prisma.orderItem.findMany({ where: { orderId: id } });
      for (const item of items) {
        if (item.productId) {
          await prisma.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        adminId: (session.user as { id?: string }).id,
        action: "ORDER_UPDATED",
        entity: "Order",
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json(order);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
