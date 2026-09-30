import "server-only";
import { Resend } from "resend";
import { render } from "@react-email/components";
import type { ReactElement } from "react";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

/** Verified sender, e.g. "TechApp Solutions <hello@techappsolutions.com>" */
const from = process.env.EMAIL_FROM ?? "TechApp Solutions <onboarding@resend.dev>";

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] RESEND_API_KEY not set. Skipped "${opts.subject}" to ${String(opts.to)}`);
    }
    return { ok: false, error: "Email is not configured" };
  }
  try {
    const [html, textVersion] = await Promise.all([
      render(opts.react),
      render(opts.react, { plainText: true }),
    ]);
    const { error } = await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html,
      text: textVersion,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("[email] Resend error:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] Failed to send:", e);
    return { ok: false, error: "Failed to send email" };
  }
}
