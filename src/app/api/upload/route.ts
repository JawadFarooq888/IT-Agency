import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { attachmentRules, validateAttachment } from "@/lib/validations/quote";
import { getClientIp, hashIp, rateLimit } from "@/lib/security";

/**
 * Saves a quote form attachment to Vercel Blob (allowed types only, up to 4MB)
 * and returns its URL, which the form then sends with the lead.
 * Works with BLOB_READ_WRITE_TOKEN, or BLOB_STORE_ID plus Vercel's built-in OIDC login.
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return NextResponse.json({ error: "File uploads are not configured." }, { status: 503 });
  }

  const ip = await getClientIp();
  try {
    const allowed = await rateLimit(`upload:${hashIp(ip)}`, 10, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many uploads. Please try again later." }, { status: 429 });
    }
  } catch (e) {
    console.error("[upload] rate limit check failed", e);
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  const invalid = validateAttachment(file);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
  if (!(attachmentRules.contentTypes as readonly string[]).includes(file.type)) {
    return NextResponse.json({ error: "Please upload a PDF, DOC, DOCX, PNG or JPG file." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "attachment";
  try {
    const blob = await put(`leads/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("[upload] failed", e);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
