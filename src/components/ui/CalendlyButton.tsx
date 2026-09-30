"use client";

import { trackEvent } from "@/lib/analytics";
import { useSettings } from "@/components/providers/SettingsProvider";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const STYLE_HREF = "https://assets.calendly.com/assets/external/widget.css";

type CalendlyApi = {
  initPopupWidget: (opts: { url: string }) => void;
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

let loader: Promise<CalendlyApi> | null = null;

/** Load the Calendly widget script once, on demand. */
export function loadCalendly(): Promise<CalendlyApi> {
  if (window.Calendly) return Promise.resolve(window.Calendly);
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${STYLE_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = STYLE_HREF;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () =>
      window.Calendly ? resolve(window.Calendly) : reject(new Error("Calendly missing"));
    script.onerror = () => {
      loader = null;
      reject(new Error("Could not load Calendly"));
    };
    document.body.appendChild(script);
  });
  return loader;
}

/** Opens the Calendly popup. Falls back to a new tab if the script fails. */
export function CalendlyButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { calendlyUrl } = useSettings();

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    trackEvent("calendly_open");
    try {
      const calendly = await loadCalendly();
      calendly.initPopupWidget({ url: calendlyUrl });
    } catch {
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <a
      href={calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
