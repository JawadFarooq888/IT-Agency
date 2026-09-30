"use server";

import { headers } from "next/headers";
import { site } from "@/content/site";
import { db, isDbConfigured } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getClientIp, hashIp, rateLimit, verifyTurnstile } from "@/lib/security";
import { getSiteSettings } from "@/lib/settings";
import { absoluteUrl, whatsappUrl } from "@/lib/utils";
import { quoteMetaSchema } from "@/lib/validations/quote";
import {
  CONSULTATION_SERVICE,
  bookingSchema,
  type BookingInput,
  type BookingResult,
} from "@/lib/validations/booking";
import { LeadNotificationEmail } from "@/emails/LeadNotificationEmail";
import { BookingConfirmationEmail } from "@/emails/BookingConfirmationEmail";

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }; // 5 requests per hour per IP

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Saves a consultation call request as a lead and sends the emails. */
export async function submitBooking(rawValues: unknown, rawMeta: unknown): Promise<BookingResult> {
  const settings = await getSiteSettings();
  const fallbackError = `Sorry, something went wrong on our side. Please message us on WhatsApp at ${settings.whatsappDisplay} to book your call.`;

  const parsed = bookingSchema.safeParse(rawValues);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof BookingInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof BookingInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  const metaParsed = quoteMetaSchema.safeParse(rawMeta);
  const meta = metaParsed.success ? metaParsed.data : {};
  const values = parsed.data;

  // Honeypot: pretend success so bots learn nothing
  if (values.website) return { ok: true };

  const ip = await getClientIp();
  const ipHash = hashIp(ip);
  try {
    if (!(await rateLimit(`booking:${ipHash}`, RATE_LIMIT.max, RATE_LIMIT.windowMs))) {
      return {
        ok: false,
        error: "You have sent several requests in a short time. Please message us on WhatsApp.",
      };
    }
  } catch (e) {
    console.error("[booking] rate limit check failed", e);
  }
  if (!(await verifyTurnstile(meta.turnstileToken, ip))) {
    return { ok: false, error: "The security check failed. Please try again." };
  }

  const timezone = values.timezone || "time zone not given";
  const dateLabel = formatDate(values.preferredDate);
  const when = `${dateLabel}, ${values.timeSlot} (${timezone})`;
  const details = [
    `Free consultation call request.`,
    `Preferred time: ${when}.`,
    values.note && `Note: ${values.note}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  let leadId = "local";
  if (isDbConfigured) {
    try {
      const lead = await db.lead.create({
        data: {
          fullName: values.fullName,
          email: values.email.toLowerCase(),
          phone: values.phone,
          service: CONSULTATION_SERVICE,
          timeline: `${values.preferredDate}, ${values.timeSlot}`,
          details,
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
      console.error("[booking] failed to save lead", e);
      return { ok: false, error: fallbackError };
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[booking] DATABASE_URL is not set");
    return { ok: false, error: fallbackError };
  }

  const firstName = values.fullName.split(" ")[0] ?? values.fullName;
  const phoneDigits = values.phone.replace(/\D/g, "");
  const adminEmail = process.env.ADMIN_EMAIL;

  const results = await Promise.allSettled([
    adminEmail
      ? sendEmail({
          to: adminEmail,
          replyTo: values.email,
          subject: `Call request: ${values.fullName}, ${dateLabel} ${values.timeSlot}`,
          react: LeadNotificationEmail({
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            service: CONSULTATION_SERVICE,
            timeline: when,
            details,
            sourcePage: meta.sourcePage,
            referrer: meta.referrer,
            whatsappReplyUrl: whatsappUrl(
              phoneDigits,
              `Hi ${firstName}, thanks for booking a call with ${site.name}. Can we confirm ${dateLabel}, ${values.timeSlot}?`,
            ),
            adminUrl: absoluteUrl(`/admin/leads/${leadId}`),
          }),
        })
      : Promise.resolve({ ok: false }),
    sendEmail({
      to: values.email,
      replyTo: settings.email,
      subject: `Thanks ${firstName}, we received your call request`,
      react: BookingConfirmationEmail({
        firstName,
        brandName: site.name,
        siteUrl: site.domain,
        preferredDate: dateLabel,
        timeSlot: values.timeSlot,
        timezone,
        whatsappUrl: whatsappUrl(
          settings.whatsappNumber,
          `Hi, I just booked a free consultation call for ${dateLabel}, ${values.timeSlot}.`,
        ),
      }),
    }),
  ]);
  for (const r of results) if (r.status === "rejected") console.error("[booking] email failed", r.reason);

  return { ok: true };
}
