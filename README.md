# OceanDry – Dried Seafood E-Commerce Store

A modern, functional e-commerce website for selling dried seafood. Built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Ready to deploy on **Vercel**.

## Features

- Product catalog with categories (Fish, Shellfish, Cephalopod, Seaweed)
- Product detail pages
- Shopping cart (persisted in localStorage)
- Checkout form (collects shipping & contact info)
- Responsive design (mobile-friendly)
- About, Contact, and Shipping pages
- Ready for Stripe (or other payment) integration

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Deploy to Vercel (recommended)

1. Push this project to a **GitHub** repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import your GitHub repo.
4. Click **Deploy**. Vercel will detect Next.js automatically.

That’s it. Your store will be live on a `*.vercel.app` URL. You can then add a custom domain in the Vercel dashboard.

## Customization

### Change products

Edit `src/data/products.ts`. Add, remove, or update items. Images currently use Unsplash placeholders — replace with your own product photos (upload to `/public` or use a CDN).

### Branding

- Store name: currently **OceanDry** (search & replace in components).
- Colors: slate + cyan theme (easy to change in Tailwind classes).
- Contact email: update in Footer and Contact page.

### Real payments (Stripe)

1. Create a Stripe account.
2. Add `@stripe/stripe-js` and `stripe`.
3. Create an API route (e.g. `/api/checkout`) that creates a Stripe Checkout Session.
4. Redirect the user to the Stripe-hosted payment page from the checkout form.

Many tutorials exist for “Next.js Stripe Checkout”.

### Order emails

Connect the checkout form to:
- [Resend](https://resend.com)
- [Formspree](https://formspree.io)
- Or your own backend / database

## Project Structure

```
src/
  app/           → pages (App Router)
  components/    → Header, Footer, ProductCard
  context/       → CartContext (global cart state)
  data/          → products.ts
```

## Notes

- This is a frontend-focused MVP. Orders are currently logged to the console and the cart is cleared after “Place Order”.
- For production you should add: real payment processing, order storage (database), email notifications, and inventory management.
- Dried seafood may have import/export regulations depending on the country — check local rules.

---

Built for your dried seafood business. Replace placeholder content with your real products, photos, and contact details.
