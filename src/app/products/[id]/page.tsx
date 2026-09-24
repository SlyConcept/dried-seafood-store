"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block text-cyan-700">
          ← Back to products
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/products"
        className="text-sm text-slate-500 hover:text-slate-800 mb-8 inline-block"
      >
        ← Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <p className="text-cyan-700 font-medium text-sm uppercase tracking-wide">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
            <span className="text-base font-normal text-slate-500 ml-2">
              / {product.weight}
            </span>
          </p>

          <p className="mt-6 text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Origin</dt>
              <dd className="font-medium text-slate-900">{product.origin}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Weight</dt>
              <dd className="font-medium text-slate-900">{product.weight}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Availability</dt>
              <dd
                className={`font-medium ${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </dd>
            </div>
          </dl>

          {product.inStock && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 hover:bg-slate-50 text-slate-600"
                >
                  −
                </button>
                <span className="px-4 py-2.5 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 hover:bg-slate-50 text-slate-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-lg font-semibold transition ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-slate-900 hover:bg-cyan-600 text-white"
                }`}
              >
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
