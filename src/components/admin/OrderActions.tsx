"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
] as const;

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export default function OrderActions({
  orderId,
  status,
  paymentStatus,
  adminNotes,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
  adminNotes: string;
}) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(status);
  const [payStatus, setPayStatus] = useState(paymentStatus);
  const [notes, setNotes] = useState(adminNotes);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: orderStatus,
        paymentStatus: payStatus,
        adminNotes: notes,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Saved");
      router.refresh();
    } else {
      setMsg("Failed to save");
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="block text-slate-500 mb-1">Order status</label>
        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-slate-500 mb-1">Payment status</label>
        <select
          value={payStatus}
          onChange={(e) => setPayStatus(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-slate-500 mb-1">Admin notes</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Internal notes..."
        />
      </div>
      {msg && (
        <p className={`text-sm ${msg === "Saved" ? "text-green-600" : "text-red-600"}`}>
          {msg}
        </p>
      )}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full bg-slate-900 hover:bg-cyan-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
      >
        {saving ? "Saving..." : "Update order"}
      </button>
    </div>
  );
}
