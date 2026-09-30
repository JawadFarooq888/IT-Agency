import type { ServiceSlug } from "./services";

/**
 * Pricing packages. Replace [$X] with your real starting prices.
 * Keep features short: one benefit per line.
 */
export type Package = {
  name: "Basic" | "Standard" | "Premium";
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export type PricingGroup = { service: ServiceSlug; title: string; packages: Package[] };

export const pricing: PricingGroup[] = [
  {
    service: "web-development",
    title: "Websites and web apps",
    packages: [
      {
        name: "Basic",
        price: "[$X]",
        description: "A clean website for a small business.",
        features: [
          "Up to [5] pages",
          "Mobile friendly design",
          "Contact form and WhatsApp button",
          "Basic SEO setup",
          "[14] days support",
        ],
      },
      {
        name: "Standard",
        price: "[$X]",
        description: "A growth website with blog and more pages.",
        features: [
          "Up to [12] pages",
          "Custom design",
          "Blog and easy editing",
          "Google Analytics and Search Console",
          "Speed optimisation",
          "[30] days support",
        ],
        popular: true,
      },
      {
        name: "Premium",
        price: "[$X]",
        description: "Online store or custom web app.",
        features: [
          "E-commerce or custom features",
          "Payments and user accounts",
          "Admin dashboard",
          "Integrations with your tools",
          "Advanced SEO setup",
          "[60] days support",
        ],
      },
    ],
  },
  {
    service: "mobile-apps",
    title: "Mobile apps",
    packages: [
      {
        name: "Basic",
        price: "[$X]",
        description: "A simple app to test your idea.",
        features: [
          "Android and iOS",
          "Up to [8] screens",
          "Login and profiles",
          "Store submission",
          "[30] days support",
        ],
      },
      {
        name: "Standard",
        price: "[$X]",
        description: "A full app with an admin panel.",
        features: [
          "Android and iOS",
          "Up to [20] screens",
          "Admin panel",
          "Push notifications",
          "Payments",
          "[60] days support",
        ],
        popular: true,
      },
      {
        name: "Premium",
        price: "[$X]",
        description: "Complex apps with custom backend.",
        features: [
          "Custom backend and APIs",
          "Real-time features",
          "Advanced integrations",
          "Analytics dashboard",
          "Priority support",
          "[90] days support",
        ],
      },
    ],
  },
  {
    service: "ai-automation",
    title: "AI and automation",
    packages: [
      {
        name: "Basic",
        price: "[$X]",
        description: "One automation or a simple chatbot.",
        features: [
          "1 workflow automation",
          "or a website FAQ chatbot",
          "Setup on your accounts",
          "[14] days support",
        ],
      },
      {
        name: "Standard",
        price: "[$X]",
        description: "A chatbot trained on your business.",
        features: [
          "Chatbot trained on your content",
          "Website and WhatsApp",
          "Lead capture to CRM or Sheets",
          "Conversation dashboard",
          "[30] days support",
        ],
        popular: true,
      },
      {
        name: "Premium",
        price: "[$X]",
        description: "AI built into your operations.",
        features: [
          "Multiple automations",
          "AI features in your software",
          "Custom integrations",
          "Human handover rules",
          "[60] days support",
        ],
      },
    ],
  },
  {
    service: "social-media-seo",
    title: "Social media and SEO",
    packages: [
      {
        name: "Basic",
        price: "[$X]/month",
        description: "Stay active on social media.",
        features: ["[12] posts per month", "2 platforms", "Post designs and captions", "Monthly report"],
      },
      {
        name: "Standard",
        price: "[$X]/month",
        description: "Social media plus SEO.",
        features: [
          "[20] posts per month",
          "3 platforms",
          "Monthly SEO work",
          "Google Business Profile",
          "Monthly report",
        ],
        popular: true,
      },
      {
        name: "Premium",
        price: "[$X]/month",
        description: "Full growth package with ads.",
        features: [
          "Everything in Standard",
          "Meta and Google Ads management",
          "Landing page improvements",
          "Conversion tracking",
          "Bi-weekly calls",
        ],
      },
    ],
  },
];
