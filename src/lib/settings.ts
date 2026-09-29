import "server-only";
import { cache } from "react";
import { defaultSettings, type SiteSettings } from "@/content/site";

/**
 * Site-wide settings (contact details, social links, stats).
 * Reads static defaults for now; overridden from the database in Phase 5.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return defaultSettings;
});
