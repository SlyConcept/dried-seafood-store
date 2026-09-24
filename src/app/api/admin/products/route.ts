import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim();
  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: body.sku || null,
        description: String(body.description || ""),
        ingredients: body.ingredients || null,
        price: parseFloat(body.price) || 0,
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        weight: body.weight || null,
        image: body.image || null,
        stock: parseInt(body.stock, 10) || 0,
        lowStockThreshold: parseInt(body.lowStockThreshold, 10) || 5,
        isAvailable: Boolean(body.isAvailable),
        isFeatured: Boolean(body.isFeatured),
        categoryId: body.categoryId || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: (session.user as { id?: string }).id,
        action: "PRODUCT_CREATED",
        entity: "Product",
        entityId: product.id,
        details: product.name,
      },
    });

    return NextResponse.json(product);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Create failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug or SKU already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
