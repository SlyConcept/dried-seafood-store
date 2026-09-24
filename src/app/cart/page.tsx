"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">
          Browse our dried seafood and add something delicious.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex bg-slate-900 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-white rounded-xl border border-slate-100 p-4"
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${product.id}`}
                  className="font-semibold text-slate-900 hover:text-cyan-700"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-slate-500 mt-0.5">
                  {product.weight} · {product.category}
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  ${product.price.toFixed(2)} each
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-sm">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1 hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right font-semibold text-slate-900">
                ${(product.price * quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="text-slate-500">Calculated at checkout</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full text-center bg-slate-900 hover:bg-cyan-600 text-white font-semibold py-3.5 rounded-lg transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="mt-3 block w-full text-center text-sm text-slate-500 hover:text-slate-800"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
