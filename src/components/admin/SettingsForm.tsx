"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: initial.business_name || "",
    whatsapp_number: initial.whatsapp_number || "",
    contact_email: initial.contact_email || "",
    contact_phone: initial.contact_phone || "",
    delivery_fee: initial.delivery_fee || "0",
    free_delivery_threshold: initial.free_delivery_threshold || "0",
    min_order_amount: initial.min_order_amount || "0",
    currency: initial.currency || "NGN",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg("Settings saved successfully");
        router.refresh();
      } else {
        setError(data.error || `Failed to save (${res.status})`);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "business_name", label: "Business name" },
    { key: "whatsapp_number", label: "WhatsApp number (with country code)" },
    { key: "contact_email", label: "Contact email" },
    { key: "contact_phone", label: "Phone" },
    { key: "currency", label: "Currency (e.g. NGN)" },
    { key: "delivery_fee", label: "Default delivery fee (₦)" },
    { key: "free_delivery_threshold", label: "Free delivery above (₦)" },
    { key: "min_order_amount", label: "Minimum order amount (₦)" },
  ] as const;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-100 p-6 space-y-4 shadow-sm"
    >
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {f.label}
          </label>
          <input
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      ))}
      {msg && <p className="text-sm text-green-600 font-medium">{msg}</p>}
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="bg-slate-900 hover:bg-cyan-600 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
