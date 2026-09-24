import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cuid() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
}

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

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        {
          error:
            "Paystack is not configured. Add PAYSTACK_SECRET_KEY in Vercel environment variables.",
        },
        { status: 503 }
      );
    }

    let subtotal = 0;
    const lineItems: {
      productId: string | null;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    for (const item of items as { id?: string; name: string; price: number; quantity: number }[]) {
      let unitPrice = Number(item.price) || 0;
      let name = item.name;
      let productId: string | null = item.id || null;

      if (item.id) {
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (product) {
          unitPrice =
            product.discountPrice != null && product.discountPrice > 0
              ? product.discountPrice
              : product.price;
          name = product.name;
          productId = product.id;
        }
      }

      const qty = Math.max(1, parseInt(String(item.quantity), 10) || 1);
      const totalPrice = unitPrice * qty;
      subtotal += totalPrice;
      lineItems.push({
        productId,
        productName: name,
        quantity: qty,
        unitPrice,
        totalPrice,
      });
    }

    const deliveryFeeSetting = await prisma.siteSetting.findUnique({
      where: { key: "delivery_fee" },
    });
    const deliveryFee = parseFloat(deliveryFeeSetting?.value || "0") || 0;
    const total = subtotal + deliveryFee;

    if (total < 1) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
    }

    let customer = await prisma.customer.findFirst({
      where: { email: String(email).toLowerCase() },
    });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          id: cuid(),
          name: `${firstName} ${lastName}`,
          email: String(email).toLowerCase(),
          phone: phone || null,
          address: address || null,
          city: city || null,
          country: country || null,
        },
      });
    }

    const orderId = cuid();
    const num = orderNumber();
    const reference = `pay_${num.replace(/-/g, "")}_${Date.now().toString(36)}`;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        orderNumber: num,
        customerId: customer.id,
        customerName: `${firstName} ${lastName}`,
        customerEmail: String(email).toLowerCase(),
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
          create: lineItems.map((i) => ({
            id: cuid(),
            ...i,
          })),
        },
        payments: {
          create: {
            id: cuid(),
            amount: total,
            method: "paystack",
            status: "PENDING",
            provider: "paystack",
            transactionId: reference,
          },
        },
      },
    });

    const amountKobo = Math.round(total * 100);
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://dried-seafood-store.vercel.app";

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: String(email).toLowerCase(),
        amount: amountKobo,
        currency: "NGN",
        reference,
        callback_url: `${baseUrl}/payment/success?reference=${encodeURIComponent(reference)}`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      }),
    });

    const paystackData = await paystackRes.json();
    if (!paystackRes.ok || !paystackData?.status) {
      console.error("Paystack init error:", paystackData);
      return NextResponse.json(
        {
          error:
            paystackData?.message ||
            "Could not start Paystack payment. Check your API keys.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      reference,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      amount: total,
    });
  } catch (e: unknown) {
    console.error("Paystack initialize error:", e);
    const msg = e instanceof Error ? e.message : "Payment init failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
