/** First-touch UTM and referrer capture, kept for the browser session. */

const KEY = "lead_attribution";
const UTM_KEYS = ["source", "medium", "campaign", "term", "content"] as const;

export type Attribution = {
  referrer?: string;
  landingPage?: string;
  utm?: Partial<Record<(typeof UTM_KEYS)[number], string>>;
};

export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Attribution["utm"] = {};
    for (const k of UTM_KEYS) {
      const v = params.get(`utm_${k}`);
      if (v) utm[k] = v.slice(0, 200);
    }
    const existing = sessionStorage.getItem(KEY);
    // Keep the first touch, unless this visit carries new UTM tags
    if (existing && Object.keys(utm).length === 0) return;
    const referrer =
      document.referrer && !document.referrer.startsWith(window.location.origin)
        ? document.referrer.slice(0, 1000)
        : undefined;
    const data: Attribution = {
      referrer,
      landingPage: window.location.pathname,
      utm: Object.keys(utm).length ? utm : undefined,
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // sessionStorage can be unavailable (private mode); attribution is optional
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
