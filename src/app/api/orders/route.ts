import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function orderNumber() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const r = Math.floor(Math.random() * 9000) + 1000;
  return `OQDV-${y}${m}${day}-${r}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      notes,
      items,
    } = body;

    if (!firstName || !lastName || !email || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, i: { price: number; quantity: number }) =>
        sum + i.price * i.quantity,
      0
    );

    const deliveryFeeSetting = await prisma.siteSetting.findUnique({
      where: { key: "delivery_fee" },
    });
    const deliveryFee = parseFloat(deliveryFeeSetting?.value || "0") || 0;
    const total = subtotal + deliveryFee;

    let customer = await prisma.customer.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: email.toLowerCase(),
          phone: phone || null,
          address: address || null,
          city: city || null,
          country: country || null,
        },
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber(),
        customerId: customer.id,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone || null,
        deliveryAddress: [address, city, state, postalCode, country]
          .filter(Boolean)
          .join(", "),
        deliveryCity: city || null,
        deliveryCountry: country || null,
        customerNotes: notes || null,
        subtotal,
        deliveryFee,
        total,
        status: "NEW",
        paymentStatus: "PENDING",
        items: {
          create: items.map(
            (i: {
              id?: string;
              name: string;
              price: number;
              quantity: number;
            }) => ({
              productId: i.id || null,
              productName: i.name,
              quantity: i.quantity,
              unitPrice: i.price,
              totalPrice: i.price * i.quantity,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber, id: order.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
