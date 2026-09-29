import { getSiteSettings } from "@/lib/settings";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { AttributionCapture } from "@/components/providers/AttributionCapture";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

/** Public site frame: skip link, navbar, footer and floating WhatsApp button. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <SettingsProvider value={settings}>
      <a
        href="#main"
        className="sr-only z-[70] rounded-btn bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp />
      <AttributionCapture />
    </SettingsProvider>
  );
}
