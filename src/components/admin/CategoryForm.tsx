"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CategoryData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
};

export default function CategoryForm({
  initial,
  onDone,
}: {
  initial?: Partial<CategoryData> & { id?: string };
  onDone?: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<CategoryData>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    sortOrder: initial?.sortOrder || "0",
    isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof CategoryData, value: string | boolean) =>
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
      ? `/api/admin/categories/${initial.id}`
      : "/api/admin/categories";
    const method = initial?.id ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      setSaving(false);
      if (!res.ok) {
        setError(data.error || "Failed to save category");
        return;
      }
      router.refresh();
      onDone?.();
    } catch {
      setSaving(false);
      setError("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g. Fish"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="fish"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sort order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />
            Active (shown on store)
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-slate-900 hover:bg-cyan-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm"
        >
          {saving ? "Saving..." : initial?.id ? "Update category" : "Add category"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
