import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { attachmentRules } from "@/lib/validations/quote";
import { getClientIp, hashIp, rateLimit } from "@/lib/security";

/**
 * Issues short-lived tokens so the quote form can upload attachments
 * straight to Vercel Blob (files up to 10MB, allowed types only).
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "File uploads are not configured." }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("leads/")) throw new Error("Invalid upload path");
        const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
        if (!(attachmentRules.extensions as readonly string[]).includes(ext)) {
          throw new Error("File type not allowed");
        }
        const ip = await getClientIp();
        const allowed = await rateLimit(`upload:${hashIp(ip)}`, 10, 60 * 60 * 1000);
        if (!allowed) throw new Error("Too many uploads. Please try again later.");
        return {
          allowedContentTypes: [...attachmentRules.contentTypes],
          maximumSizeInBytes: attachmentRules.maxBytes,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do: the blob URL is saved with the lead when the form is submitted.
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
