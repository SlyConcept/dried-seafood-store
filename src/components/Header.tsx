"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🐟</span>
            <span className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition leading-tight">
              Optimum Quality Divine Ventures
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-slate-300 hover:text-white transition text-sm font-medium"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-slate-300 hover:text-white transition text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-slate-300 hover:text-white transition text-sm font-medium"
            >
              Contact
            </Link>
          </nav>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
