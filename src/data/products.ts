// Shared product type for cart and UI.
// Live catalog is loaded from the database via src/lib/catalog.ts

export type Product = {
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

/** @deprecated static list — catalog now comes from the database */
export const products: Product[] = [];

export const categories = ["All", "Fish", "Shellfish", "Cephalopod", "Seaweed"];

export function getProductById(_id: string): Product | undefined {
  return undefined;
}
