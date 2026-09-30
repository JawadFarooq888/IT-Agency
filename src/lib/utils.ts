import { site } from "@/content/site";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Build a wa.me link with an optional pre-filled message. */
export function whatsappUrl(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Default pre-filled WhatsApp message, optionally naming a service. */
export function whatsappMessage(serviceName?: string): string {
  return `Hi, I found you on your website and I need help with ${serviceName ?? "a project"}.`;
}

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
