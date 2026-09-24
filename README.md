# Optimum Quality Divine Ventures – Dried Seafood E-Commerce Store

A modern, functional e-commerce website for selling dried seafood. Built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Deployed on **Vercel**.

## Features

- Product catalog with categories (Fish, Shellfish, Cephalopod, Seaweed)
- Product detail pages with quantity selector
- Shopping cart (persisted in localStorage)
- Full checkout form (contact + shipping address)
- Responsive design (mobile-friendly)
- About, Contact, and Shipping pages
- Ready for Stripe (or other payment) integration

## Live Site

**https://dried-seafood-store.vercel.app**

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customization

### Change products
Edit `src/data/products.ts`. Replace Unsplash images with your own product photos.

### Branding
- Store name: **Optimum Quality Divine Ventures**
- Contact email: update in Footer and Contact page.

### Real payments (Stripe)
1. Create a Stripe account.
2. Add `@stripe/stripe-js` and `stripe`.
3. Create an API route that creates a Stripe Checkout Session.
4. Redirect from the checkout form to Stripe.

## Project Structure

```
src/
  app/           → pages (App Router)
  components/    → Header, Footer, ProductCard
  context/       → CartContext
  data/          → products.ts
```

Built for Optimum Quality Divine Ventures. Replace placeholder content with your real products, photos, and contact details.
