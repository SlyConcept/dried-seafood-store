import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div>
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
              Premium dried fish, shrimp, squid, and seaweed sourced from trusted
              waters. Quality you can taste — shipped worldwide.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition"
              >
                Shop Products
              </Link>
              <Link
                href="/about"
                className="border border-slate-600 hover:border-cyan-500 text-white px-6 py-3 rounded-lg transition"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Featured Products
            </h2>
            <p className="mt-2 text-slate-500">
              Hand-picked dried seafood favorites
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline text-cyan-700 hover:underline text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-slate-500 text-center py-12">
            Products will appear here once added in the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="text-cyan-700 hover:underline text-sm font-medium">
            View all products →
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Premium Quality",
              desc: "Carefully selected dried seafood meeting strict standards for flavor and safety.",
            },
            {
              title: "Worldwide Shipping",
              desc: "We ship internationally with packaging designed for long-distance delivery.",
            },
            {
              title: "Trusted Sources",
              desc: "Sourced from reputable waters and processors around the world.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
              <p className="mt-2 text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
