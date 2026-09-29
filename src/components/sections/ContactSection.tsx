import type { SiteSettings } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ContactCards } from "./ContactCards";

export function ContactSection({
  settings,
  service,
  title = "Tell us about your project",
  description = "Send the form and get a free, fixed price quote. We reply within 24 hours, usually much sooner.",
}: {
  settings: SiteSettings;
  /** Service title to pre-select in the form and name in WhatsApp messages */
  service?: { title: string; name: string };
  title?: string;
  description?: string;
}) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div>
          <SectionHeader id="contact-title" eyebrow="Get in touch" title={title} description={description} />
          <div className="mt-8">
            <ContactCards settings={settings} service={service?.name} />
          </div>
        </div>
        <div id="quote" className="card scroll-mt-24 p-5 sm:p-8">
          <QuoteForm defaultService={service?.title} />
        </div>
      </Container>
    </section>
  );
}
