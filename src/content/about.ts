import { Eye, HeartHandshake, Target, Zap, type LucideIcon } from "lucide-react";
import type { Tint } from "./services";

/** About page content. Replace [placeholders] with your real story and team. */
export const story = [
  "[YourBrand] started in [2020] when [founder name] began building websites for local businesses in [City]. Clients kept asking for more: a mobile app, a better way to manage orders, help with Google and social media.",
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

export type TeamMember = { name: string; role: string; photo?: string };

export const team: TeamMember[] = [
  { name: "[Founder name]", role: "[Founder and Lead Developer]" },
  { name: "[Team member]", role: "[UI/UX Designer]" },
  { name: "[Team member]", role: "[Mobile Developer]" },
  { name: "[Team member]", role: "[Marketing and SEO Lead]" },
];
