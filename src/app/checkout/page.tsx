"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
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
        <h1 className="text-3xl font-bold text-slate-900">Order Received!</h1>
        <p className="mt-4 text-slate-600">
          Thank you for your order. We have received your details and will
          contact you shortly with payment instructions and shipping options.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          (This is a demo checkout. Connect Stripe or your preferred payment
          provider for live payments.)
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex bg-slate-900 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { form, items, totalPrice });
    clearCart();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First name *
                </label>
                <input
                  required
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last name *
                </label>
                <input
                  required
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Street address *
                </label>
                <input
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    State / Province
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Postal code *
                  </label>
                  <input
                    required
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Country *
                </label>
                <input
                  required
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g. United States, Nigeria, Singapore..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Order notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Any special instructions for shipping or packaging..."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Order Summary
            </h2>
            <ul className="space-y-3 text-sm mb-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between">
                  <span className="text-slate-600">
                    {product.name} × {quantity}
                  </span>
                  <span className="font-medium">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Shipping cost will be calculated and confirmed after order review.
              Payment instructions will be sent by email.
            </p>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 hover:bg-cyan-600 text-white font-semibold py-3.5 rounded-lg transition"
            >
              Place Order
            </button>

            <p className="mt-4 text-xs text-center text-slate-400">
              By placing an order you agree to our terms. This is currently a
              demo checkout — connect a payment provider for live transactions.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
