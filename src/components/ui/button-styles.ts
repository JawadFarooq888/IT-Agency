import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "whatsapp" | "dark" | "light" | "outline-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn font-semibold whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  outline: "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-card",
  whatsapp: "bg-whatsapp-strong text-white hover:bg-whatsapp-hover",
  dark: "bg-ink text-white hover:bg-ink-soft",
  light: "bg-white text-ink hover:bg-tint-blue",
  "outline-light": "border border-white/30 text-white hover:border-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-[15px]",
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-7 text-[17px]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}
