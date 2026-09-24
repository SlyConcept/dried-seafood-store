import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: String(body.name || "").trim(),
        slug: String(body.slug || "").trim(),
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
        action: "PRODUCT_UPDATED",
        entity: "Product",
        entityId: product.id,
        details: product.name,
      },
    });

    return NextResponse.json(product);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        adminId: (session.user as { id?: string }).id,
        action: "PRODUCT_DELETED",
        entity: "Product",
        entityId: id,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
