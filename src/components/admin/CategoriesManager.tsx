"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "./CategoryForm";

type Cat = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

export default function CategoriesManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<Cat | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const startEdit = (c: Cat) => {
    setEditing(c);
    setMode("edit");
    setError("");
  };

  const handleDelete = async (id: string, name: string, productCount: number) => {
    if (productCount > 0) {
      setError(
        `"${name}" has ${productCount} product(s). Move or delete those products first, or keep the category.`
      );
      return;
    }
    if (!confirm(`Delete category "${name}"?`)) return;
    setDeleting(id);
    setError("");
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
          <p className="text-sm text-slate-500 mt-1">
            {categories.length} categories · used on the store product filters
          </p>
        </div>
        {mode === "list" && (
          <button
            type="button"
            onClick={() => {
              setMode("add");
              setEditing(null);
              setError("");
            }}
            className="bg-slate-900 hover:bg-cyan-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
          >
            + Add category
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {(mode === "add" || mode === "edit") && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">
            {mode === "edit" ? "Edit category" : "New category"}
          </h3>
          <CategoryForm
            initial={
              editing
                ? {
                    id: editing.id,
                    name: editing.name,
                    slug: editing.slug,
                    description: editing.description || "",
                    sortOrder: String(editing.sortOrder),
                    isActive: editing.isActive,
                  }
                : undefined
            }
            onDone={() => {
              setMode("list");
              setEditing(null);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No categories yet. Add one to organize your products.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.slug}</td>
                  <td className="px-4 py-3">{c.sortOrder}</td>
                  <td className="px-4 py-3">{c.productCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="text-cyan-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deleting === c.id}
                      onClick={() => handleDelete(c.id, c.name, c.productCount)}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deleting === c.id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
