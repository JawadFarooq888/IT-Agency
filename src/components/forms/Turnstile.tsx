"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
    },
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loader: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing"));
    script.onerror = () => {
      loader = null;
      reject(new Error("Could not load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return loader;
}

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/**
 * Cloudflare Turnstile widget. Renders nothing when no site key is configured
 * (local development). Change `resetKey` to get a fresh token after a submit.
 */
export function Turnstile({
  onToken,
  resetKey,
}: {
  onToken: (token: string | null) => void;
  resetKey: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!turnstileSiteKey || !ref.current) return;
    let widgetId: string | null = null;
    let cancelled = false;
    const el = ref.current;

    loadTurnstile()
      .then((ts) => {
        if (cancelled) return;
        widgetId = ts.render(el, {
          sitekey: turnstileSiteKey,
          theme: "light",
          size: "flexible",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [resetKey]);

  if (!turnstileSiteKey) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
