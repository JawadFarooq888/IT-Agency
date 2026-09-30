import { z } from "zod";
import { serviceOptions } from "@/content/services";

export const budgetOptions = ["Under $500", "$500 to $2k", "$2k to $10k", "$10k+"] as const;
export const timelineOptions = ["ASAP", "1 month", "1 to 3 months", "Flexible"] as const;

export const countryCodes = [
  { iso: "US", dial: "+1", label: "United States (+1)" },
  { iso: "GB", dial: "+44", label: "United Kingdom (+44)" },
  { iso: "AE", dial: "+971", label: "UAE (+971)" },
  { iso: "PK", dial: "+92", label: "Pakistan (+92)" },
  { iso: "SA", dial: "+966", label: "Saudi Arabia (+966)" },
  { iso: "QA", dial: "+974", label: "Qatar (+974)" },
  { iso: "CA", dial: "+1", label: "Canada (+1)" },
  { iso: "AU", dial: "+61", label: "Australia (+61)" },
  { iso: "DE", dial: "+49", label: "Germany (+49)" },
  { iso: "IN", dial: "+91", label: "India (+91)" },
  { iso: "OTHER", dial: "", label: "Other (type code in number)" },
] as const;

export const countryIsoCodes = countryCodes.map((c) => c.iso) as [string, ...string[]];

/** Attachment rules, shared by the form and the upload endpoint. */
export const attachmentRules = {
  maxBytes: 10 * 1024 * 1024,
  extensions: ["pdf", "doc", "docx", "png", "jpg", "jpeg"],
  contentTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
  ],
} as const;

/** Returns an error message, or null when the file is allowed. */
export function validateAttachment(file: { name: string; size: number; type: string }): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(attachmentRules.extensions as readonly string[]).includes(ext)) {
    return "Please upload a PDF, DOC, DOCX, PNG or JPG file.";
  }
  if (file.size > attachmentRules.maxBytes) return "The file must be 10MB or smaller.";
  return null;
}

/** The quote form. Same schema validates in the browser and in the server action. */
export const quoteFormSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100, "Name is too long."),
  email: z.string().trim().max(200).pipe(z.email("Please enter a valid email address.")),
  phoneCountry: z.enum(countryIsoCodes),
  phone: z
    .string()
    .trim()
    .max(25)
    .refine((v) => v === "" || /^\+?[0-9\s()-]{6,20}$/.test(v), "Please enter a valid phone number."),
  company: z.string().trim().max(120, "Company name is too long."),
  service: z.enum(serviceOptions, "Please choose a service."),
  budget: z.enum(budgetOptions).optional(),
  timeline: z.enum(timelineOptions).optional(),
  details: z
    .string()
    .trim()
    .min(20, "Please tell us a bit more (at least 20 characters).")
    .max(5000, "Please keep project details under 5000 characters."),
  consent: z.literal(true, "Please accept the privacy policy to continue."),
  /** Honeypot: real users never see or fill this */
  website: z.string().max(200).optional(),
});

export type QuoteFormInput = z.input<typeof quoteFormSchema>;
export type QuoteFormValues = z.output<typeof quoteFormSchema>;

/** Extra data sent alongside the form (not typed in by the user). */
export const quoteMetaSchema = z.object({
  turnstileToken: z.string().max(4096).optional(),
  attachment: z
    .object({
      url: z.url().max(1000),
      name: z.string().max(255),
      size: z.number().int().nonnegative().max(attachmentRules.maxBytes),
    })
    .optional(),
  sourcePage: z.string().max(500).optional(),
  referrer: z.string().max(1000).optional(),
  utm: z
    .object({
      source: z.string().max(200).optional(),
      medium: z.string().max(200).optional(),
      campaign: z.string().max(200).optional(),
      term: z.string().max(200).optional(),
      content: z.string().max(200).optional(),
    })
    .optional(),
});

export type QuoteMeta = z.infer<typeof quoteMetaSchema>;

export type QuoteResult =
  { ok: true } | { ok: false; error: string; fieldErrors?: Partial<Record<keyof QuoteFormInput, string>> };
