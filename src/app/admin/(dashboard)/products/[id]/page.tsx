import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-cyan-700 hover:underline">
          ← Products
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 mt-2">Edit product</h2>
      </div>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku || "",
          description: product.description,
          ingredients: product.ingredients || "",
          price: String(product.price),
          discountPrice: product.discountPrice != null ? String(product.discountPrice) : "",
          weight: product.weight || "",
          image: product.image || "",
          stock: String(product.stock),
          lowStockThreshold: String(product.lowStockThreshold),
          isAvailable: product.isAvailable,
          isFeatured: product.isFeatured,
          categoryId: product.categoryId || "",
        }}
      />
    </div>
  );
}
