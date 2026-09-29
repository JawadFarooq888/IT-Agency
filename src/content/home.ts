import { CalendarCheck, FileSignature, LifeBuoy, ReceiptText, type LucideIcon } from "lucide-react";
import type { Tint } from "./services";

export const processSteps = [
  { title: "Discuss", text: "A free call to understand your business, goals and budget." },
  { title: "Plan & Quote", text: "A clear scope, timeline and fixed price within [48] hours." },
  { title: "Design", text: "You see and approve the design before any code is written." },
  { title: "Develop", text: "We build in small steps and show you progress every week." },
  { title: "Launch & Support", text: "We go live, train your team and stay on for support." },
];

export const whyUs: { title: string; text: string; icon: LucideIcon; tint: Tint }[] = [
  {
    title: "Fixed price quotes",
    text: "You know the full cost before we start. No surprise invoices.",
    icon: ReceiptText,
    tint: "blue",
  },
  {
    title: "Weekly updates",
    text: "A short progress update and demo every week, so you are never in the dark.",
    icon: CalendarCheck,
    tint: "orange",
  },
  {
    title: "NDA on request",
    text: "Your idea stays yours. We are happy to sign an NDA before you share details.",
    icon: FileSignature,
    tint: "green",
  },
  {
    title: "Support after launch",
    text: "Free support after launch and simple monthly plans if you need more.",
    icon: LifeBuoy,
    tint: "blue",
  },
];

/** Placeholder client logos. Replace with real logos (with permission). */
export const clientLogos = [
  "[Client logo 1]",
  "[Client logo 2]",
  "[Client logo 3]",
  "[Client logo 4]",
  "[Client logo 5]",
  "[Client logo 6]",
];
