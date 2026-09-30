/**
 * Static defaults for company details. Values in [square brackets] are
 * placeholders you must replace. Contact details, social links and stats
 * can also be changed later from /admin/settings without touching code.
 */
/** Public URL: NEXT_PUBLIC_SITE_URL, else the Vercel production URL, else localhost. */
function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "TechApp Solutions",
  /** Shown in the footer, legal pages and share images. Change when you buy your own domain. */
  domain: "itagency.vercel.app",
  url: siteUrl(),
  tagline: "We build the websites, apps and AI tools that grow your business.",
  description:
    "Web development, mobile apps, AI automation, cloud and digital marketing for small and medium businesses and startups. Fixed price quotes and replies within 24 hours.",
  shortDescription: "Software, AI and digital growth under one roof for small businesses and startups.",
  countries: ["US", "UK", "UAE", "Pakistan"],
  foundedYear: "[2020]",
} as const;

export type SiteSettings = {
  whatsappNumber: string; // digits only, with country code, e.g. 923001234567
  whatsappDisplay: string; // how the number is shown on the site
  email: string;
  location: string;
  mapQuery: string; // used for the Google Map embed on /contact
  social: {
    linkedin: string;
    facebook: string;
    instagram: string;
    upwork: string;
  };
  stats: {
    projects: string;
    rating: string;
    replyTime: string;
  };
  countriesLabel: string;
};

export const defaultSettings: SiteSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923354427428",
  whatsappDisplay: "+92 335 4427428",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@techappsolutions.com",
  location: "[City], Pakistan",
  mapQuery: "Lahore, Pakistan",
  // Empty links are hidden. Add your real profile URLs here or in /admin/settings.
  social: {
    linkedin: "https://www.linkedin.com/in/jawad-farooq-5755731ab",
    facebook: "",
    instagram: "",
    upwork: "",
  },
  stats: {
    projects: "[50+]",
    rating: "[5.0]",
    replyTime: "24h",
  },
  countriesLabel: "the US, UK, UAE and Pakistan",
};
