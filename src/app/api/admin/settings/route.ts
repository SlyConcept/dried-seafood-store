import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function cuid() {
  return (
    "c" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 12)
  );
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role && role !== "SUPER_ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const keys = Object.keys(body);

    for (const key of keys) {
      const value = String(body[key] ?? "");
      const existing = await prisma.siteSetting.findUnique({ where: { key } });
      if (existing) {
        await prisma.siteSetting.update({
          where: { key },
          data: { value },
        });
      } else {
        await prisma.siteSetting.create({
          data: {
            id: cuid(),
            key,
            value,
          },
        });
      }
    }

    try {
      await prisma.auditLog.create({
        data: {
          id: cuid(),
          adminId: (session.user as { id?: string }).id || null,
          action: "SETTINGS_UPDATED",
          entity: "SiteSetting",
          details: JSON.stringify(keys),
        },
      });
    } catch {
      // Don't fail the save if audit log fails
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("Settings save error:", e);
    const msg = e instanceof Error ? e.message : "Failed to save";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
