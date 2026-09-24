import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function cuid() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        id: cuid(),
        name,
        slug,
        sku: body.sku ? String(body.sku) : null,
        description: String(body.description || ""),
        ingredients: body.ingredients ? String(body.ingredients) : null,
        price: parseFloat(body.price) || 0,
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        weight: body.weight ? String(body.weight) : null,
        image: body.image ? String(body.image) : null,
        stock: parseInt(body.stock, 10) || 0,
        lowStockThreshold: parseInt(body.lowStockThreshold, 10) || 5,
        isAvailable: body.isAvailable !== false && body.isAvailable !== "false",
        isFeatured: Boolean(body.isFeatured === true || body.isFeatured === "true"),
        categoryId: body.categoryId ? String(body.categoryId) : null,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          id: cuid(),
          adminId: (session.user as { id?: string }).id || null,
          action: "PRODUCT_CREATED",
          entity: "Product",
          entityId: product.id,
          details: product.name,
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json(product);
  } catch (e: unknown) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Create failed";
    if (msg.includes("Unique constraint") || msg.includes("unique")) {
      return NextResponse.json({ error: "Slug or SKU already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
