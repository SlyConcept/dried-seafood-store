import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-900 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-cyan-400 font-medium tracking-wide uppercase text-sm mb-4">
              Premium Quality · Worldwide Shipping
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Dried Seafood,{" "}
              <span className="text-cyan-400">Delivered Fresh</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              From sun-dried anchovies to premium nori and smoked mackerel —
              carefully selected dried seafood for home cooks and restaurants
              around the world.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-8 py-3.5 rounded-lg transition shadow-lg shadow-cyan-500/20"
              >
                Shop All Products
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-white font-medium px-8 py-3.5 rounded-lg transition"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🌍", title: "International Shipping", desc: "We ship worldwide" },
              { icon: "✨", title: "Premium Quality", desc: "Carefully selected" },
              { icon: "📦", title: "Secure Packaging", desc: "Fresh on arrival" },
              { icon: "🔒", title: "Secure Checkout", desc: "Safe payments" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <span className="text-2xl mb-2">{item.icon}</span>
                <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Featured Products
            </h2>
            <p className="mt-2 text-slate-500">
              Our most popular dried seafood selections
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex text-cyan-700 hover:text-cyan-800 font-medium text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex text-cyan-700 hover:text-cyan-800 font-medium"
          >
            View all products →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cyan-50 border-y border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Ready to stock your kitchen?
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Browse our full catalog of dried fish, shrimp, squid, seaweed and
            more. Orders ship worldwide.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3.5 rounded-lg transition"
          >
            Browse Catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
