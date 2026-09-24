"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
    notes: "",
  });

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/products" className="mt-4 inline-block text-cyan-700">
          Go shopping
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-slate-900">Order received</h1>
        <p className="mt-4 text-slate-600">
          Thank you for your order
          {orderNum ? ` (${orderNum})` : ""}. We will contact you with payment
          or delivery details.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex bg-slate-900 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        })),
      };

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.authorization_url) {
        setOrderNum(data.orderNumber || "");
        window.location.href = data.authorization_url;
        return;
      }

      if (res.status === 503) {
        const fb = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const fbData = await fb.json();
        if (fb.ok) {
          setOrderNum(fbData.orderNumber || "");
          clearCart();
          setSubmitted(true);
          return;
        }
      }

      alert(data.error || "Could not start payment. Please try again.");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    name: keyof typeof form,
    label: string,
    opts?: { required?: boolean; type?: string; full?: boolean }
  ) => (
    <div className={opts?.full ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {opts?.required !== false ? " *" : ""}
      </label>
      <input
        required={opts?.required !== false}
        type={opts?.type || "text"}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("firstName", "First name")}
              {field("lastName", "Last name")}
              {field("email", "Email", { type: "email" })}
              {field("phone", "Phone (WhatsApp)", { required: false })}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Delivery address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("address", "Street address", { full: true })}
              {field("city", "City")}
              {field("state", "State", { required: false })}
              {field("postalCode", "Postal code", { required: false })}
              {field("country", "Country")}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Order notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Delivery instructions..."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Order summary
            </h2>
            <ul className="space-y-3 text-sm mb-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between gap-2">
                  <span className="text-slate-600">
                    {product.name} × {quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Pay securely in Naira (₦) with card, bank transfer, or USSD via
              Paystack.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-slate-900 hover:bg-cyan-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition"
            >
              {submitting
                ? "Redirecting to Paystack..."
                : "Pay securely with Paystack"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
