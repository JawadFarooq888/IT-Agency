export type AnalyticsEvent =
  | "quote_form_submit"
  | "whatsapp_click"
  | "email_click"
  | "calendly_open";

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

/** Send a GA4 event. Does nothing when GA is not configured. */
export function trackEvent(name: AnalyticsEvent, params?: Record<string, string | number>): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, { page_path: window.location.pathname, ...params });
}
