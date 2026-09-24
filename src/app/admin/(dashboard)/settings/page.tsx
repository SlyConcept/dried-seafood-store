import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  await requireRole(["SUPER_ADMIN", "MANAGER"]);
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Business Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          These settings control the customer-facing website
        </p>
      </div>
      <SettingsForm initial={map} />
    </div>
  );
}
