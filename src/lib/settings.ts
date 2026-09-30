import "server-only";
import { cache } from "react";
import { z } from "zod";
import { defaultSettings, type SiteSettings } from "@/content/site";
import { db, isDbConfigured } from "./db";

/** Validation for settings saved from /admin/settings. */
export const siteSettingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, "Digits only, with country code, e.g. 923001234567"),
  whatsappDisplay: z.string().trim().min(1).max(40),
  email: z.email().max(200),
  location: z.string().trim().min(1).max(120),
  mapQuery: z.string().trim().min(1).max(200),
  social: z.object({
    linkedin: z.union([z.url(), z.literal("")]),
    facebook: z.union([z.url(), z.literal("")]),
    instagram: z.union([z.url(), z.literal("")]),
    upwork: z.union([z.url(), z.literal("")]),
  }),
  stats: z.object({
    projects: z.string().trim().min(1).max(20),
    rating: z.string().trim().min(1).max(20),
    replyTime: z.string().trim().min(1).max(20),
  }),
  countriesLabel: z.string().trim().min(1).max(200),
});

/** Site-wide settings: static defaults merged with values saved in the admin panel. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isDbConfigured) return defaultSettings;
  try {
    const row = await db.siteSetting.findUnique({ where: { key: "site" } });
    if (!row) return defaultSettings;
    const saved = row.value as Partial<SiteSettings>;
    return {
      ...defaultSettings,
      ...saved,
      social: { ...defaultSettings.social, ...saved.social },
      stats: { ...defaultSettings.stats, ...saved.stats },
    };
  } catch (e) {
    console.error("[settings] failed to load, using defaults", e);
    return defaultSettings;
  }
});
