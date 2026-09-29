import type { PortfolioCategory, ServiceSlug } from "./services";

/**
 * Placeholder case studies. Replace every [placeholder] with real project
 * details. Once the database is connected they are managed from /admin/portfolio.
 */
export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  country: string;
  category: PortfolioCategory;
  services: ServiceSlug[];
  summary: string;
  problem: string;
  solution: string;
  result: string;
  results: string[];
  tech: string[];
  coverImage?: string;
  gallery: string[];
  testimonial?: { quote: string; name: string; role: string };
};

export const portfolioCategories: { value: PortfolioCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "ai", label: "AI" },
];

const placeholderTestimonial = {
  quote: "[Paste a short, real quote from this client about the project.]",
  name: "[Client name]",
  role: "[Role, Company]",
};

export const defaultCaseStudies: CaseStudy[] = [
  {
    slug: "project-web-one",
    title: "[Online store for a retail brand]",
    client: "[Client name]",
    industry: "[Retail]",
    country: "[UK]",
    category: "web",
    services: ["web-development", "ui-ux-design"],
    summary: "[One sentence about what you built and for whom.]",
    problem: "[What was not working for the client before the project.]",
    solution: "[What you built and the key decisions you made.]",
    result: "[Main result with a real number]",
    results: ["[Real result 1]", "[Real result 2]", "[Real result 3]"],
    tech: ["Next.js", "Stripe", "PostgreSQL"],
    gallery: [],
    testimonial: placeholderTestimonial,
  },
  {
    slug: "project-mobile-one",
    title: "[Booking app for a service business]",
    client: "[Client name]",
    industry: "[Health and wellness]",
    country: "[UAE]",
    category: "mobile",
    services: ["mobile-apps"],
    summary: "[One sentence about what you built and for whom.]",
    problem: "[What was not working for the client before the project.]",
    solution: "[What you built and the key decisions you made.]",
    result: "[Main result with a real number]",
    results: ["[Real result 1]", "[Real result 2]", "[Real result 3]"],
    tech: ["Flutter", "Firebase"],
    gallery: [],
    testimonial: placeholderTestimonial,
  },
  {
    slug: "project-ai-one",
    title: "[AI chatbot that answers customer questions]",
    client: "[Client name]",
    industry: "[Real estate]",
    country: "[US]",
    category: "ai",
    services: ["ai-automation"],
    summary: "[One sentence about what you built and for whom.]",
    problem: "[What was not working for the client before the project.]",
    solution: "[What you built and the key decisions you made.]",
    result: "[Main result with a real number]",
    results: ["[Real result 1]", "[Real result 2]", "[Real result 3]"],
    tech: ["OpenAI", "n8n", "WhatsApp API"],
    gallery: [],
    testimonial: placeholderTestimonial,
  },
  {
    slug: "project-web-two",
    title: "[Company website redesign]",
    client: "[Client name]",
    industry: "[Professional services]",
    country: "[Pakistan]",
    category: "web",
    services: ["web-development", "social-media-seo"],
    summary: "[One sentence about what you built and for whom.]",
    problem: "[What was not working for the client before the project.]",
    solution: "[What you built and the key decisions you made.]",
    result: "[Main result with a real number]",
    results: ["[Real result 1]", "[Real result 2]"],
    tech: ["WordPress", "Google Analytics 4"],
    gallery: [],
  },
  {
    slug: "project-ai-two",
    title: "[Workflow automation for an operations team]",
    client: "[Client name]",
    industry: "[Logistics]",
    country: "[UK]",
    category: "ai",
    services: ["ai-automation", "database-cloud"],
    summary: "[One sentence about what you built and for whom.]",
    problem: "[What was not working for the client before the project.]",
    solution: "[What you built and the key decisions you made.]",
    result: "[Main result with a real number]",
    results: ["[Real result 1]", "[Real result 2]"],
    tech: ["Python", "Zapier", "Google Sheets API"],
    gallery: [],
  },
  {
    slug: "project-mobile-two",
    title: "[Delivery tracking app]",
    client: "[Client name]",
    industry: "[Food and beverage]",
    country: "[Pakistan]",
    category: "mobile",
    services: ["mobile-apps", "database-cloud"],
    summary: "[One sentence about what you built and for whom.]",
    problem: "[What was not working for the client before the project.]",
    solution: "[What you built and the key decisions you made.]",
    result: "[Main result with a real number]",
    results: ["[Real result 1]", "[Real result 2]"],
    tech: ["React Native", "Node.js", "PostgreSQL"],
    gallery: [],
  },
];
