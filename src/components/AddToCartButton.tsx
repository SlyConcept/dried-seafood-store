"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-slate-600 hover:bg-slate-50"
        >
          −
        </button>
        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-2 text-slate-600 hover:bg-slate-50"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-8 py-3 rounded-lg transition"
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </button>
    </div>
  );
}
