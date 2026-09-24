"use client";

import { useSearchParams } from "next/navigation";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Suspense } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "All";

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
        <p className="mt-2 text-slate-500">
          Premium dried seafood ready to ship worldwide
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/products" : `/products?category=${cat}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-center py-20">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
