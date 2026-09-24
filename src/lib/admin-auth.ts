import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireAdmin();
  const role = (session.user as { role?: string }).role;
  if (!role || !roles.includes(role)) {
    redirect("/admin");
  }
  return session;
}
