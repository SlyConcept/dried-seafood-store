import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐟</span>
              <span className="text-xl font-bold text-white">OceanDry</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium dried seafood sourced from trusted waters around the
              world. Quality you can taste.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-cyan-400 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Fish" className="hover:text-cyan-400 transition">
                  Dried Fish
                </Link>
              </li>
              <li>
                <Link href="/products?category=Shellfish" className="hover:text-cyan-400 transition">
                  Shellfish
                </Link>
              </li>
              <li>
                <Link href="/products?category=Seaweed" className="hover:text-cyan-400 transition">
                  Seaweed
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-cyan-400 transition">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: orders@oceandry.example</li>
              <li>We ship internationally</li>
              <li className="pt-2 text-xs">
                Note: Replace with your real contact details
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} OceanDry. All rights reserved.</p>
          <p className="text-xs">
            Built for dried seafood businesses · Ready for Stripe payments
          </p>
        </div>
      </div>
    </footer>
  );
}
