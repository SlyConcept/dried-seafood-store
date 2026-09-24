import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import Image from "next/image";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500 mt-1">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-slate-900 hover:bg-cyan-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      {p.image && (
                        <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.weight}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 font-medium">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= p.lowStockThreshold ? "text-red-600 font-medium" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {p.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-cyan-700 hover:underline text-sm">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
