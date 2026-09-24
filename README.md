# OceanDry – Dried Seafood E-Commerce Store

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

Check your Vercel dashboard for the live URL (usually `https://dried-seafood-store.vercel.app`).

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
- Store name is currently **OceanDry** (search & replace in components).
- Contact email: update in Footer and Contact page.

### Real payments (Stripe)
1. Create a Stripe account.
2. Add `@stripe/stripe-js` and `stripe`.
3. Create an API route that creates a Stripe Checkout Session.
4. Redirect from the checkout form to Stripe.

### Order emails
Connect the checkout form to Resend, Formspree, or your own backend.

## Project Structure

```
src/
  app/           → pages (App Router)
  components/    → Header, Footer, ProductCard
  context/       → CartContext
  data/          → products.ts
```

Built for your dried seafood business. Replace placeholder content with your real products, photos, and contact details.
