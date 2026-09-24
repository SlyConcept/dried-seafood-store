"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "";
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    paid?: boolean;
    orderNumber?: string | null;
    amount?: number;
    status?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setResult({ error: "Missing payment reference" });
      return;
    }
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        if (data.paid) clearCart();
      })
      .catch(() => setResult({ error: "Could not verify payment" }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-pulse text-slate-500">Verifying payment…</div>
      </div>
    );
  }

  if (result?.paid) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-slate-900">Payment successful</h1>
        <p className="mt-4 text-slate-600">
          Thank you! Your payment of{" "}
          <strong>{formatPrice(result.amount || 0)}</strong> was received.
        </p>
        {result.orderNumber && (
          <p className="mt-2 text-slate-700 font-medium">
            Order number: {result.orderNumber}
          </p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          We will process your order and contact you with delivery details.
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

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-3xl font-bold text-slate-900">Payment not confirmed</h1>
      <p className="mt-4 text-slate-600">
        {result?.error ||
          (result?.status === "abandoned"
            ? "Payment was not completed."
            : "We could not confirm this payment yet.")}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        If money left your account, contact us with reference:{" "}
        <code className="bg-slate-100 px-1 rounded">{reference}</code>
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/checkout"
          className="bg-slate-900 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Try again
        </Link>
        <Link
          href="/products"
          className="border border-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-slate-500">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
