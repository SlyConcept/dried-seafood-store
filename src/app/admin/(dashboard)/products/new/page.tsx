import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default async function NewProductPage() {
  await requireAdmin();
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
        <h2 className="text-2xl font-bold text-slate-900 mt-2">Add product</h2>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
