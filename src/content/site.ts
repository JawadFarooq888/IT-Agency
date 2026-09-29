/**
 * Static defaults for company details. Values in [square brackets] are
 * placeholders you must replace. Contact details, social links and stats
 * can also be changed later from /admin/settings without touching code.
 */
export const site = {
  name: "YourBrand",
  domain: "yourbrand.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "We build the websites, apps and AI tools that grow your business.",
  description:
    "Web development, mobile apps, AI automation, cloud and digital marketing for small and medium businesses and startups. Fixed price quotes and replies within 24 hours.",
  shortDescription:
    "Software, AI and digital growth under one roof for small businesses and startups.",
  countries: ["US", "UK", "UAE", "Pakistan"],
  foundedYear: "[2020]",
} as const;

export type SiteSettings = {
  whatsappNumber: string; // digits only, with country code, e.g. 923001234567
  whatsappDisplay: string; // how the number is shown on the site
  email: string;
  calendlyUrl: string;
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
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923000000000",
  whatsappDisplay: "[+92 3XX XXXXXXX]",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@yourbrand.com",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/yourbrand/20min",
  location: "[City], Pakistan",
  mapQuery: "Lahore, Pakistan",
  social: {
    linkedin: "https://www.linkedin.com/company/yourbrand",
    facebook: "https://www.facebook.com/yourbrand",
    instagram: "https://www.instagram.com/yourbrand",
    upwork: "https://www.upwork.com/agencies/yourbrand",
  },
  stats: {
    projects: "[50+]",
    rating: "[5.0]",
    replyTime: "24h",
  },
  countriesLabel: "the US, UK, UAE and Pakistan",
};
