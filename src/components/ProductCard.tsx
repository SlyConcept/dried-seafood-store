"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-cyan-700 font-medium uppercase tracking-wide mb-1">
          {product.category} · {product.weight}
        </p>
        <h3 className="font-semibold text-slate-900 group-hover:text-cyan-700 transition line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              added
                ? "bg-green-500 text-white"
                : product.inStock
                ? "bg-slate-900 text-white hover:bg-cyan-600"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
