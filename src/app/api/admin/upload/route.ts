import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions accept request bodies up to 4.5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];

/**
 * Admin image uploads (team photos, portfolio, blog covers). Admins only.
 * The file is sent here and saved to Vercel Blob on the server. That works with
 * BLOB_READ_WRITE_TOKEN, or with BLOB_STORE_ID plus Vercel's built-in OIDC login
 * (what a Blob store connected from the Storage tab adds).
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Please log in again." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return NextResponse.json(
      {
        error:
          "Image upload is not set up yet. Connect a Blob store in Vercel (Storage tab), or paste an image URL.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Please choose a PNG, JPG, WebP or AVIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be 4MB or smaller." }, { status: 413 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "image";
  try {
    const blob = await put(`content/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("[admin upload] failed", e);
    return NextResponse.json(
      { error: "The upload failed on the server. Try again, or paste an image URL." },
      { status: 500 },
    );
  }
}
