import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderActions from "@/components/admin/OrderActions";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true },
  });
  if (!order) notFound();

  const whatsappSetting = await prisma.siteSetting.findUnique({
    where: { key: "whatsapp_number" },
  });
  const whatsapp = (whatsappSetting?.value || "").replace(/\D/g, "");

  const phone = (order.customerPhone || "").replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hello ${order.customerName}, regarding your order ${order.orderNumber} from Optimum Quality Divine Ventures.`
  );
  const waLink = phone
    ? `https://wa.me/${phone}?text=${waMessage}`
    : whatsapp
      ? `https://wa.me/${whatsapp}?text=${waMessage}`
      : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/orders" className="text-sm text-cyan-700 hover:underline">
          ← Orders
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4 mt-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{order.orderNumber}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Placed {order.createdAt.toLocaleString()}
            </p>
          </div>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
            >
              Contact via WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-slate-900">Customer</h3>
          <dl className="text-sm space-y-2">
            <div><dt className="text-slate-500">Name</dt><dd className="font-medium">{order.customerName}</dd></div>
            <div><dt className="text-slate-500">Email</dt><dd>{order.customerEmail || "—"}</dd></div>
            <div><dt className="text-slate-500">Phone</dt><dd>{order.customerPhone || "—"}</dd></div>
            <div><dt className="text-slate-500">Address</dt><dd>{order.deliveryAddress || "—"}</dd></div>
            {order.customerNotes && (
              <div><dt className="text-slate-500">Customer notes</dt><dd>{order.customerNotes}</dd></div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">Status</h3>
          <OrderActions
            orderId={order.id}
            status={order.status}
            paymentStatus={order.paymentStatus}
            adminNotes={order.adminNotes || ""}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Items</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Qty</th>
              <th className="px-5 py-3 font-medium">Unit</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3 font-medium">{item.productName}</td>
                <td className="px-5 py-3">{item.quantity}</td>
                <td className="px-5 py-3">${item.unitPrice.toFixed(2)}</td>
                <td className="px-5 py-3 text-right">${item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-200">
            <tr>
              <td colSpan={3} className="px-5 py-2 text-right text-slate-500">Subtotal</td>
              <td className="px-5 py-2 text-right">${order.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-5 py-2 text-right text-slate-500">Delivery</td>
              <td className="px-5 py-2 text-right">${order.deliveryFee.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-5 py-3 text-right font-semibold">Total</td>
              <td className="px-5 py-3 text-right font-bold text-lg">${order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
