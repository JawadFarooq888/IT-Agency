import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/sections/PageHero";
import { ContactCards } from "@/components/sections/ContactCards";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { BookCallForm } from "@/components/forms/BookCallForm";

export const metadata: Metadata = {
  title: "Contact Us: Get a Free Quote",
  description:
    "Tell us about your project and get a free, fixed price quote within 24 hours. Contact us by form, WhatsApp, email or book a call.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", href: "/contact" }]}
        eyebrow="Contact"
        title="Let's talk about your project"
        description="Send the form for a free, fixed price quote, or reach us directly on WhatsApp, email or a quick video call. We reply within 24 hours."
      />

      <section aria-label="Contact options" className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="space-y-8">
            <ContactCards settings={settings} />
            <ul className="space-y-3 text-[15px]">
              <li className="flex items-center gap-3">
                <MapPin aria-hidden="true" className="size-5 shrink-0 text-muted" />
                {settings.location}
              </li>
              <li className="flex items-center gap-3">
                <Clock aria-hidden="true" className="size-5 shrink-0 text-muted" />
                Replies within 24 hours, 7 days a week
              </li>
            </ul>
          </div>
          <div id="quote" className="card scroll-mt-24 p-5 sm:p-8">
            <QuoteForm />
          </div>
        </Container>
      </section>

      <section
        id="book"
        aria-labelledby="book-title"
        className="scroll-mt-24 border-y border-line bg-card py-16 lg:py-24"
      >
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <SectionHeader
            id="book-title"
            eyebrow="Book a call"
            title="Prefer to talk? Pick a time"
            description="A free 20 minute call on WhatsApp or Google Meet to discuss your project and next steps. No pressure, no sales pitch."
          >
            <ul className="mt-8 space-y-3 text-[17px] text-ink">
              {[
                "Choose a day and a time window",
                "We confirm the exact time within 24 hours",
                "Talk through your idea, budget and timeline",
              ].map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tint-blue font-display text-sm font-semibold text-tint-blue-ink">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </SectionHeader>
          <div className="rounded-card border border-line bg-canvas p-5 sm:p-8">
            <BookCallForm headingLevel="h3" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="map-title" className="py-16 lg:py-24">
        <Container>
          <SectionHeader
            id="map-title"
            eyebrow="Location"
            title={`Based in ${settings.location}`}
            description="We work remotely with clients all over the world."
          />
          <div className="mt-10 overflow-hidden rounded-card border border-line">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`}
              title={`Map of ${settings.location}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
