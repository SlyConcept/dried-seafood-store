import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 8MB before compression" },
        { status: 400 }
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, or GIF images are allowed" },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());

    let output: Buffer;
    try {
      output = await sharp(input)
        .rotate()
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 78 })
        .toBuffer();
    } catch {
      if (input.length > 4.5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Could not compress this image. Try JPEG or PNG under 4MB." },
          { status: 400 }
        );
      }
      output = input;
    }

    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, output, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: "image/webp",
      });
      return NextResponse.json({
        url: blob.url,
        size: output.length,
        originalSize: input.length,
      });
    }

    const dataUrl = `data:image/webp;base64,${output.toString("base64")}`;
    if (dataUrl.length > 900_000) {
      return NextResponse.json(
        { error: "Image still too large after compression." },
        { status: 400 }
      );
    }
    return NextResponse.json({
      url: dataUrl,
      size: output.length,
      originalSize: input.length,
    });
  } catch (e: unknown) {
    console.error("Upload error:", e);
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
