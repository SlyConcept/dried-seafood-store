import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    totalProducts,
    lowStock,
    pendingCatering,
    pendingBulk,
    revenueAgg,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["NEW", "CONFIRMED", "PROCESSING"] } } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.customer.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.cateringRequest.count({ where: { status: "NEW" } }),
    prisma.bulkOrder.count({ where: { status: "NEW" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ]);

  const totalSales = revenueAgg._sum.total ?? 0;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [ordersToday, salesToday] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: todayStart }, paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const cards = [
    { label: "Total Sales", value: `$${totalSales.toFixed(2)}`, color: "bg-emerald-500" },
    { label: "Today's Sales", value: `$${(salesToday._sum.total ?? 0).toFixed(2)}`, color: "bg-cyan-500" },
    { label: "Orders Today", value: String(ordersToday), color: "bg-blue-500" },
    { label: "Pending Orders", value: String(pendingOrders), color: "bg-amber-500" },
    { label: "Completed Orders", value: String(completedOrders), color: "bg-green-600" },
    { label: "Total Customers", value: String(totalCustomers), color: "bg-indigo-500" },
    { label: "Pending Catering", value: String(pendingCatering), color: "bg-purple-500" },
    { label: "Pending Bulk", value: String(pendingBulk), color: "bg-rose-500" },
    { label: "Products", value: String(totalProducts), color: "bg-slate-600" },
    { label: "Low Stock", value: String(lowStock), color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">
          Business overview for Optimum Quality Divine Ventures
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${c.color} mb-3`} />
            <p className="text-xs text-slate-500 font-medium">{c.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm text-cyan-700 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      <Link href={`/admin/orders/${o.id}`} className="hover:text-cyan-700">{o.orderNumber}</Link>
                    </td>
                    <td className="px-6 py-3">{o.customerName}</td>
                    <td className="px-6 py-3">${o.total.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{o.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
