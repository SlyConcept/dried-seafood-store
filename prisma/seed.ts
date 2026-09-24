import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@optimumquality.com" },
    update: {},
    create: {
      email: "admin@optimumquality.com",
      name: "Super Admin",
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  });
  console.log("Admin:", admin.email);

  const categories = [
    { name: "Fish", slug: "fish", sortOrder: 1 },
    { name: "Shellfish", slug: "shellfish", sortOrder: 2 },
    { name: "Cephalopod", slug: "cephalopod", sortOrder: 3 },
    { name: "Seaweed", slug: "seaweed", sortOrder: 4 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const fish = await prisma.category.findUnique({ where: { slug: "fish" } });
  const shellfish = await prisma.category.findUnique({ where: { slug: "shellfish" } });
  const cephalopod = await prisma.category.findUnique({ where: { slug: "cephalopod" } });
  const seaweed = await prisma.category.findUnique({ where: { slug: "seaweed" } });

  const products = [
    {
      name: "Premium Dried Anchovies",
      slug: "dried-anchovies",
      description: "Sun-dried anchovies with a rich umami flavor. Perfect for soups, stews, or snacking.",
      price: 12.99,
      weight: "250g",
      stock: 50,
      isFeatured: true,
      categoryId: fish?.id,
      image: "https://images.unsplash.com/photo-1615141982883-c7ad07f93548?w=600&h=600&fit=crop",
    },
    {
      name: "Dried Shrimp (Large)",
      slug: "dried-shrimp",
      description: "High-quality large dried shrimp with intense seafood aroma.",
      price: 18.5,
      weight: "200g",
      stock: 40,
      isFeatured: true,
      categoryId: shellfish?.id,
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=600&fit=crop",
    },
    {
      name: "Dried Squid Strips",
      slug: "dried-squid",
      description: "Chewy and flavorful dried squid strips. Great as a healthy snack.",
      price: 15.75,
      weight: "150g",
      stock: 35,
      categoryId: cephalopod?.id,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=600&fit=crop",
    },
    {
      name: "Atlantic Dried Cod",
      slug: "dried-cod",
      description: "Classic dried salt cod. Mild flavor, perfect for traditional recipes.",
      price: 24.99,
      weight: "400g",
      stock: 25,
      isFeatured: true,
      categoryId: fish?.id,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop",
    },
    {
      name: "Premium Nori Sheets",
      slug: "dried-seaweed",
      description: "Crispy roasted nori seaweed sheets. Perfect for sushi and wraps.",
      price: 9.99,
      weight: "50 sheets",
      stock: 60,
      categoryId: seaweed?.id,
      image: "https://images.unsplash.com/photo-1615367423045-1d8e4f5e0c5a?w=600&h=600&fit=crop",
    },
    {
      name: "Smoked Dried Mackerel",
      slug: "dried-mackerel",
      description: "Lightly smoked and dried mackerel fillets. Bold flavor.",
      price: 16.25,
      weight: "300g",
      stock: 30,
      categoryId: fish?.id,
      image: "https://images.unsplash.com/photo-1604329760661-e7b8e2e3c8a5?w=600&h=600&fit=crop",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, isAvailable: true },
    });
  }

  const settings = [
    { key: "business_name", value: "Optimum Quality Divine Ventures" },
    { key: "whatsapp_number", value: "2348000000000" },
    { key: "contact_email", value: "orders@optimumquality.example" },
    { key: "contact_phone", value: "" },
    { key: "currency", value: "USD" },
    { key: "delivery_fee", value: "5.00" },
    { key: "free_delivery_threshold", value: "50.00" },
    { key: "min_order_amount", value: "10.00" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
