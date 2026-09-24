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
};

export const products: Product[] = [
  {
    id: "dried-anchovies",
    name: "Premium Dried Anchovies",
    description:
      "Sun-dried anchovies with a rich umami flavor. Perfect for soups, stews, or snacking. Carefully cleaned and dried using traditional methods.",
    price: 12.99,
    category: "Fish",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad07f93548?w=600&h=600&fit=crop",
    weight: "250g",
    origin: "Southeast Asia",
    inStock: true,
  },
  {
    id: "dried-shrimp",
    name: "Dried Shrimp (Large)",
    description:
      "High-quality large dried shrimp with intense seafood aroma. Ideal for fried rice, noodles, and Asian cuisine. No additives or preservatives.",
    price: 18.50,
    category: "Shellfish",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=600&fit=crop",
    weight: "200g",
    origin: "Multiple origins",
    inStock: true,
  },
  {
    id: "dried-squid",
    name: "Dried Squid Strips",
    description:
      "Chewy and flavorful dried squid strips. Great as a healthy snack or ingredient in salads and stir-fries. Naturally dried under the sun.",
    price: 15.75,
    category: "Cephalopod",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=600&fit=crop",
    weight: "150g",
    origin: "Pacific",
    inStock: true,
  },
  {
    id: "dried-cod",
    name: "Atlantic Dried Cod",
    description:
      "Classic dried salt cod (bacalhau style). Mild flavor, perfect for traditional recipes from Europe, the Caribbean, and beyond. Soak before use.",
    price: 24.99,
    category: "Fish",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop",
    weight: "400g",
    origin: "North Atlantic",
    inStock: true,
  },
  {
    id: "dried-seaweed",
    name: "Premium Nori Sheets",
    description:
      "Crispy roasted nori seaweed sheets. Perfect for sushi, wraps, or as a seasoning. Rich in minerals and umami.",
    price: 9.99,
    category: "Seaweed",
    image: "https://images.unsplash.com/photo-1615367423045-1d8e4f5e0c5a?w=600&h=600&fit=crop",
    weight: "50 sheets",
    origin: "East Asia",
    inStock: true,
  },
  {
    id: "dried-mackerel",
    name: "Smoked Dried Mackerel",
    description:
      "Lightly smoked and dried mackerel fillets. Bold flavor, excellent for salads, pasta, or eating as is. Sustainably sourced.",
    price: 16.25,
    category: "Fish",
    image: "https://images.unsplash.com/photo-1604329760661-e7b8e2e3c8a5?w=600&h=600&fit=crop",
    weight: "300g",
    origin: "Northern Europe",
    inStock: true,
  },
  {
    id: "dried-oysters",
    name: "Dried Oysters",
    description:
      "Premium dried oysters with concentrated briny sweetness. A delicacy used in Chinese soups and stews. High in zinc and protein.",
    price: 29.99,
    category: "Shellfish",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=600&fit=crop",
    weight: "100g",
    origin: "East Asia",
    inStock: true,
  },
  {
    id: "bonito-flakes",
    name: "Katsuobushi (Bonito Flakes)",
    description:
      "Traditional Japanese dried and fermented skipjack tuna flakes. Essential for dashi stock and as a topping for okonomiyaki and takoyaki.",
    price: 14.50,
    category: "Fish",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad07f93548?w=600&h=600&fit=crop",
    weight: "80g",
    origin: "Japan",
    inStock: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export const categories = ["All", "Fish", "Shellfish", "Cephalopod", "Seaweed"];
