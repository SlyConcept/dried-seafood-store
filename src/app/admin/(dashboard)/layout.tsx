import { requireAdmin } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const user = session.user as { name?: string | null; role?: string };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar userName={user.name} userRole={user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">
              Business Management
            </h1>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-700 hover:underline"
            >
              View store →
            </a>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
