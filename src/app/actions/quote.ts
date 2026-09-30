"use server";

import { headers } from "next/headers";
import { site } from "@/content/site";
import { db, isDbConfigured } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getClientIp, hashIp, rateLimit, verifyTurnstile } from "@/lib/security";
import { getSiteSettings } from "@/lib/settings";
import { absoluteUrl, whatsappMessage, whatsappUrl } from "@/lib/utils";
import {
  countryCodes,
  quoteFormSchema,
  quoteMetaSchema,
  type QuoteFormInput,
  type QuoteResult,
} from "@/lib/validations/quote";
import { LeadNotificationEmail } from "@/emails/LeadNotificationEmail";
import { ClientAutoReplyEmail } from "@/emails/ClientAutoReplyEmail";

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }; // 5 requests per hour per IP

function isAllowedAttachmentUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function submitQuote(rawValues: unknown, rawMeta: unknown): Promise<QuoteResult> {
  const settings = await getSiteSettings();
  const fallbackError = `Sorry, something went wrong on our side. Please try again, or message us on WhatsApp or at ${settings.email}.`;

  // 1. Validate with the same schema as the browser
  const parsed = quoteFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof QuoteFormInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof QuoteFormInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  const metaParsed = quoteMetaSchema.safeParse(rawMeta);
  const meta = metaParsed.success ? metaParsed.data : {};
  const values = parsed.data;

  // 2. Honeypot: pretend success so bots learn nothing
  if (values.website) return { ok: true };

  // 3. Rate limit + Turnstile
  const ip = await getClientIp();
  const ipHash = hashIp(ip);
  try {
    const allowed = await rateLimit(`quote:${ipHash}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
    if (!allowed) {
      return {
        ok: false,
        error:
          "You have sent several requests in a short time. Please wait an hour or message us on WhatsApp.",
      };
    }
  } catch (e) {
    console.error("[quote] rate limit check failed", e);
  }

  if (!(await verifyTurnstile(meta.turnstileToken, ip))) {
    return { ok: false, error: "The security check failed. Please try again." };
  }

  const attachment =
    meta.attachment && isAllowedAttachmentUrl(meta.attachment.url) ? meta.attachment : undefined;

  const dial = countryCodes.find((c) => c.iso === values.phoneCountry)?.dial ?? "";
  const phone = values.phone
    ? values.phone.startsWith("+") || !dial
      ? values.phone
      : `${dial} ${values.phone}`
    : null;

  // 4. Save the lead
  let leadId = "local";
  if (isDbConfigured) {
    try {
      const lead = await db.lead.create({
        data: {
          fullName: values.fullName,
          email: values.email.toLowerCase(),
          phone,
          company: values.company || null,
          service: values.service,
          budget: values.budget ?? null,
          timeline: values.timeline ?? null,
          details: values.details,
          attachmentUrl: attachment?.url ?? null,
          attachmentName: attachment?.name ?? null,
          sourcePage: meta.sourcePage ?? null,
          referrer: meta.referrer ?? null,
          utmSource: meta.utm?.source ?? null,
          utmMedium: meta.utm?.medium ?? null,
          utmCampaign: meta.utm?.campaign ?? null,
          utmTerm: meta.utm?.term ?? null,
          utmContent: meta.utm?.content ?? null,
          ipHash,
          userAgent: (await headers()).get("user-agent")?.slice(0, 500) ?? null,
        },
        select: { id: true },
      });
      leadId = lead.id;
    } catch (e) {
      console.error("[quote] failed to save lead", e);
      return { ok: false, error: fallbackError };
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[quote] DATABASE_URL is not set");
    return { ok: false, error: fallbackError };
  }

  // 5. Emails. The lead is already saved, so email problems do not fail the request.
  const firstName = values.fullName.split(" ")[0] ?? values.fullName;
  const phoneDigits = phone?.replace(/\D/g, "");
  const utm = meta.utm
    ? Object.entries(meta.utm)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ")
    : null;
  const adminEmail = process.env.ADMIN_EMAIL;
  const serviceForMessage = values.service === "Other" ? undefined : values.service;

  const results = await Promise.allSettled([
    adminEmail
      ? sendEmail({
          to: adminEmail,
          replyTo: values.email,
          subject: `New lead: ${values.fullName} (${values.service}${values.budget ? `, ${values.budget}` : ""})`,
          react: LeadNotificationEmail({
            ...values,
            phone,
            company: values.company || null,
            attachmentUrl: attachment?.url,
            attachmentName: attachment?.name,
            sourcePage: meta.sourcePage,
            referrer: meta.referrer,
            utm: utm || null,
            whatsappReplyUrl: phoneDigits
              ? whatsappUrl(
                  phoneDigits,
                  `Hi ${firstName}, thanks for contacting ${site.name} about ${values.service}. `,
                )
              : null,
            adminUrl: absoluteUrl(`/admin/leads/${leadId}`),
          }),
        })
      : Promise.resolve({ ok: false }),
    sendEmail({
      to: values.email,
      replyTo: settings.email,
      subject: `Thanks ${firstName}, we will reply within 24 hours`,
      react: ClientAutoReplyEmail({
        firstName,
        service: values.service,
        brandName: site.name,
        siteUrl: site.domain,
        whatsappUrl: whatsappUrl(settings.whatsappNumber, whatsappMessage(serviceForMessage)),
        bookCallUrl: absoluteUrl("/contact#book"),
      }),
    }),
  ]);
  for (const r of results) if (r.status === "rejected") console.error("[quote] email failed", r.reason);
  const autoReply = results[1];

  return { ok: true, confirmationSent: autoReply.status === "fulfilled" && autoReply.value.ok };
}
