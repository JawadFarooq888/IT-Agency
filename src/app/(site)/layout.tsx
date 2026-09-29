import { getSiteSettings } from "@/lib/settings";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
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
    </SettingsProvider>
  );
}
