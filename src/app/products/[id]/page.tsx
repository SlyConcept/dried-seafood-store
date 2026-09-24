import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreProductByIdOrSlug, getStoreProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getStoreProductByIdOrSlug(id);
  if (!product) notFound();

  const all = await getStoreProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="text-sm text-cyan-700 hover:underline">
        ← Back to products
      </Link>

      <div className="mt-6 grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <p className="text-sm text-cyan-700 font-medium">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>
          {product.weight && (
            <p className="mt-1 text-slate-500">{product.weight}</p>
          )}
          <p className="mt-4 text-2xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-6 text-slate-600 leading-relaxed">{product.description}</p>

          <div className="mt-8">
            {product.inStock ? (
              <AddToCartButton product={product} />
            ) : (
              <p className="text-red-600 font-medium">Out of stock</p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Related products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
