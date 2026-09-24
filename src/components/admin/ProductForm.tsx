"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type ProductData = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  ingredients: string;
  price: string;
  discountPrice: string;
  weight: string;
  image: string;
  stock: string;
  lowStockThreshold: string;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
};

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Partial<ProductData> & { id?: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductData>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    sku: initial?.sku || "",
    description: initial?.description || "",
    ingredients: initial?.ingredients || "",
    price: initial?.price || "",
    discountPrice: initial?.discountPrice || "",
    weight: initial?.weight || "",
    image: initial?.image || "",
    stock: initial?.stock || "0",
    lowStockThreshold: initial?.lowStockThreshold || "5",
    isAvailable: initial?.isAvailable ?? true,
    isFeatured: initial?.isFeatured ?? false,
    categoryId: initial?.categoryId || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof ProductData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onNameChange = (name: string) => {
    set("name", name);
    if (!initial?.id) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      set("slug", slug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = initial?.id
      ? `/api/admin/products/${initial.id}`
      : "/api/admin/products";
    const method = initial?.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save product");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initial?.id || !confirm("Delete this product permanently?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${initial.id}`, {
      method: "DELETE",
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError("Failed to delete");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-6 space-y-5 shadow-sm max-w-3xl">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Product name *</label>
          <input required value={form.name} onChange={(e) => onNameChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
          <input required value={form.slug} onChange={(e) => set("slug", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
          <input value={form.sku} onChange={(e) => set("sku", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Weight / size</label>
          <input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 250g"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
          <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Discount price</label>
          <input type="number" step="0.01" min="0" value={form.discountPrice} onChange={(e) => set("discountPrice", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
          <input required type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Low-stock threshold</label>
          <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => set("lowStockThreshold", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
          <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Ingredients</label>
          <textarea rows={2} value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => set("isAvailable", e.target.checked)} />
            Available for sale
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
            Featured on homepage
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="bg-slate-900 hover:bg-cyan-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition">
          {saving ? "Saving..." : initial?.id ? "Update product" : "Create product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-50">
          Cancel
        </button>
        {initial?.id && (
          <button type="button" onClick={handleDelete} disabled={saving}
            className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium px-4">
            Delete product
          </button>
        )}
      </div>
    </form>
  );
}
