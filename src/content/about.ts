import { Eye, HeartHandshake, Target, Zap, type LucideIcon } from "lucide-react";
import type { Tint } from "./services";

/** About page content. Replace [placeholders] with your real story and team. */
export const story = [
  "TechApp Solutions started in [2020] when Jawad Farooq began building websites for local businesses in Islamabad. Clients kept asking for more: a mobile app, a better way to manage orders, help with Google and social media.",
  "Today we are a small team of [X] developers, designers and marketers. We work with small and medium businesses and startups in the US, UK, UAE and Pakistan, and we keep the same simple promise: clear prices, honest advice and work that helps you grow.",
];

export const mission =
  "Make modern software, AI and digital marketing simple and affordable for small businesses, so they can compete with the big players.";

export const values: { title: string; text: string; icon: LucideIcon; tint: Tint }[] = [
  {
    title: "Honest advice",
    text: "We tell you what you need, and what you do not.",
    icon: HeartHandshake,
    tint: "green",
  },
  {
    title: "Clear communication",
    text: "Weekly updates in plain English, no jargon.",
    icon: Eye,
    tint: "blue",
  },
  {
    title: "Results first",
    text: "We measure success by leads, sales and time saved.",
    icon: Target,
    tint: "orange",
  },
  {
    title: "Fast and reliable",
    text: "Replies within 24 hours and deadlines we keep.",
    icon: Zap,
    tint: "blue",
  },
];

/** A person on the About page. Edited in /admin/team once a database is connected. */
export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
  email?: string;
  phone?: string;
  /** Paragraphs, shown in the founder section */
  bio?: string[];
  /** The first featured member gets the big "Meet the founder" section */
  featured?: boolean;
};

/** Founder section on the About page. Edit the message in your own words. */
export const founder: TeamMember = {
  name: "Jawad Farooq",
  role: "Founder & CEO",
  photo: "/team/ceo.jpg",
  email: "jawadbuu888@gmail.com",
  phone: "+92 335 4427428",
  featured: true,
  bio: [
    "I started this company to give small businesses the same quality of software and digital marketing that big companies get, at a price that makes sense.",
    "Every project gets my personal attention: a clear plan, a fixed price and honest advice. If something will not help your business grow, I will tell you.",
  ],
};

/** Used when no database is connected. */
export const defaultTeam: TeamMember[] = [
  founder,
  { name: "[Team member]", role: "[UI/UX Designer]" },
  { name: "[Team member]", role: "[Mobile Developer]" },
  { name: "[Team member]", role: "[Marketing and SEO Lead]" },
];
