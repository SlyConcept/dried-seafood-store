import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function cuid() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        id: cuid(),
        name,
        slug,
        description: body.description ? String(body.description) : null,
        sortOrder: parseInt(body.sortOrder, 10) || 0,
        isActive: body.isActive !== false && body.isActive !== "false",
      },
    });

    return NextResponse.json(category);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Create failed";
    if (msg.includes("Unique") || msg.includes("unique")) {
      return NextResponse.json({ error: "Name or slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
