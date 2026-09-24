import { prisma } from "./prisma";

export type StoreProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  weight: string;
  origin: string;
  inStock: boolean;
  slug?: string;
  discountPrice?: number | null;
};

function mapProduct(p: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  weight: string | null;
  image: string | null;
  stock: number;
  isAvailable: boolean;
  category: { name: string } | null;
}): StoreProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.discountPrice != null && p.discountPrice > 0 ? p.discountPrice : p.price,
    category: p.category?.name || "Uncategorized",
    image:
      p.image ||
      "https://images.unsplash.com/photo-1615141982883-c7ad07f93548?w=600&h=600&fit=crop",
    weight: p.weight || "",
    origin: "",
    inStock: p.isAvailable && p.stock > 0,
    slug: p.slug,
    discountPrice: p.discountPrice,
  };
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });
    return products.map(mapProduct);
  } catch (e) {
    console.error("getStoreProducts", e);
    return [];
  }
}

export async function getFeaturedProducts(limit = 4): Promise<StoreProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isAvailable: true, isFeatured: true },
      include: { category: true },
      take: limit,
      orderBy: { updatedAt: "desc" },
    });
    if (products.length > 0) return products.map(mapProduct);
    const any = await prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true },
      take: limit,
      orderBy: { name: "asc" },
    });
    return any.map(mapProduct);
  } catch (e) {
    console.error("getFeaturedProducts", e);
    return [];
  }
}

export async function getStoreProductByIdOrSlug(
  idOrSlug: string
): Promise<StoreProduct | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: { category: true },
    });
    if (!product) return null;
    return mapProduct(product);
  } catch (e) {
    console.error("getStoreProductByIdOrSlug", e);
    return null;
  }
}

export async function getStoreCategories(): Promise<string[]> {
  try {
    const cats = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return ["All", ...cats.map((c) => c.name)];
  } catch {
    return ["All"];
  }
}
