import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { processSteps } from "@/content/home";
import { getSiteSettings } from "@/lib/settings";
import { getCaseStudies, getFaqs, getTestimonials } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonClasses } from "@/components/ui/button-styles";
import { Hero } from "@/components/sections/home/Hero";
import { TrustStrip } from "@/components/sections/home/TrustStrip";
import { WhyUs } from "@/components/sections/home/WhyUs";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PortfolioFilter } from "@/components/sections/PortfolioFilter";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ContactSection } from "@/components/sections/ContactSection";

export default async function HomePage() {
  const [settings, caseStudies, testimonials, faqs] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <TrustStrip countriesLabel={settings.countriesLabel} />

      <section id="services" aria-labelledby="services-title" className="py-20 lg:py-28">
        <Container>
          <SectionHeader
            id="services-title"
            eyebrow="What we do"
            title="Everything you need to grow online"
            description="Pick one service or let us handle the whole project. Every service comes with a fixed price quote."
          />
          <div className="mt-12">
            <ServicesGrid />
          </div>
        </Container>
      </section>

      <section id="process" aria-labelledby="process-title" className="border-y border-line bg-card py-20 lg:py-28">
        <Container>
          <SectionHeader
            id="process-title"
            eyebrow="How we work"
            title="A clear process from idea to launch"
            description="Five simple steps. You always know what is happening and what comes next."
          />
          <div className="mt-12">
            <ProcessSteps steps={processSteps} />
          </div>
        </Container>
      </section>

      <section id="work" aria-labelledby="work-title" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              id="work-title"
              eyebrow="Our work"
              title="Projects that solved real problems"
              description="A few recent projects, shown as the problem we were asked to fix and the result."
            />
            <Link href="/portfolio" className={buttonClasses("outline", "md", "self-start md:self-auto")}>
              View all projects <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-10">
            <PortfolioFilter items={caseStudies} limit={3} />
          </div>
        </Container>
      </section>

      <Testimonials items={testimonials} />
      <WhyUs />

      <section id="faq" aria-labelledby="faq-title" className="border-t border-line bg-card py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeader
            id="faq-title"
            eyebrow="FAQ"
            title="Questions we often get"
            description="Cannot find your answer? Send us a message on WhatsApp and we will reply the same day."
          />
          <FaqAccordion items={faqs} />
        </Container>
      </section>

      <ContactSection settings={settings} />
    </>
  );
}
