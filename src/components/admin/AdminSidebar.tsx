"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🦐" },
  { href: "/admin/categories", label: "Categories", icon: "📁" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/catering", label: "Catering", icon: "🍽️" },
  { href: "/admin/bulk-orders", label: "Bulk Orders", icon: "📋" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar({
  userName,
  userRole,
}: {
  userName?: string | null;
  userRole?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen shrink-0">
      <div className="p-5 border-b border-slate-700">
        <p className="text-xs text-cyan-400 font-medium uppercase tracking-wide">
          Admin
        </p>
        <p className="text-white font-semibold text-sm mt-1 leading-tight">
          Optimum Quality Divine Ventures
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active
                  ? "bg-cyan-600 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-sm text-white font-medium truncate">{userName}</p>
        <p className="text-xs text-slate-500 mt-0.5">{userRole}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-3 w-full text-left text-sm text-slate-400 hover:text-white transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
