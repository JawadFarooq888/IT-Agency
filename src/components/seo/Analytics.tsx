import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

/**
 * Google Analytics 4. Loads only when NEXT_PUBLIC_GA_ID is set.
 * Page views on client navigation are tracked by GA4 enhanced measurement.
 * Custom events are sent with trackEvent() from src/lib/analytics.ts.
 */
export function Analytics() {
  if (!/^G-[A-Z0-9]+$/.test(gaId)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
