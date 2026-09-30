import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { getService, services } from "@/content/services";
import { site } from "@/content/site";
import { getCaseStudies } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";
import { absoluteUrl } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button-styles";
import { WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PortfolioCard } from "@/components/sections/PortfolioCard";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ContactSection } from "@/components/sections/ContactSection";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.seo.title, description: service.seo.description },
  };
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const [settings, caseStudies] = await Promise.all([getSiteSettings(), getCaseStudies()]);
  const related = caseStudies
    .filter((c) => c.services.includes(service.slug) || c.category === service.portfolioCategory)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            serviceType: service.title,
            description: service.seo.description,
            url: absoluteUrl(`/services/${service.slug}`),
            provider: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
            areaServed: ["US", "GB", "AE", "PK"],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]}
      />

      <PageHero
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
        eyebrow={service.title}
        title={service.hero.headline}
        description={service.hero.subtext}
        aside={
          <div className="card p-6 md:p-8">
            <IconBadge icon={service.icon} tint={service.tint} size="lg" />
            <p className="mt-6 text-sm font-medium text-muted">Starting from</p>
            <p className="mt-1 font-display text-4xl font-bold tracking-tight text-ink">
              {service.startingPrice}
            </p>
            <p className="mt-2 text-[15px]">{service.priceNote}</p>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
              {service.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-canvas px-3 py-1 text-sm text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#quote" className={buttonClasses("primary", "lg")}>
            Get a free quote <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
          <WhatsAppLink service={service.name} className={buttonClasses("whatsapp", "lg")}>
            <WhatsAppIcon className="size-5" /> Chat on WhatsApp
          </WhatsAppLink>
        </div>
      </PageHero>

      {/* Problems we solve */}
      <section aria-labelledby="problems-title" className="py-16 lg:py-24">
        <Container>
          <SectionHeader id="problems-title" eyebrow="Problems we solve" title="Sound familiar?" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {service.problems.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 2) * 70} className="card flex gap-4 p-6">
                <CircleAlert aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-tint-orange-ink" />
                <div>
                  <h3 className="heading-3">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* What you get + tech stack */}
      <section aria-labelledby="deliverables-title" className="border-y border-line bg-card py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader id="deliverables-title" eyebrow="What you get" title="Everything included" />
            <ul className="mt-8 space-y-3">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-[17px] text-ink">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-tint-green text-tint-green-ink">
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader eyebrow="Tech stack" title="Tools we use" />
            <div className="mt-8 space-y-6">
              {service.techStack.map((g) => (
                <div key={g.group}>
                  <h3 className="text-[15px] font-semibold text-ink">{g.group}</h3>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line bg-canvas px-3.5 py-1.5 text-[15px] text-ink"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section aria-labelledby="process-title" className="py-16 lg:py-24">
        <Container>
          <SectionHeader id="process-title" eyebrow="Our process" title={`How we deliver ${service.name}`} />
          <div className="mt-10">
            <ProcessSteps steps={service.process} />
          </div>
        </Container>
      </section>

      {/* Related work */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line py-16 lg:py-24">
          <Container>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeader id="related-title" eyebrow="Related work" title="Recent projects" />
              <Link href="/portfolio" className={buttonClasses("outline", "md", "self-start md:self-auto")}>
                View all projects <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <PortfolioCard item={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Pricing + FAQs */}
      <section aria-labelledby="faq-title" className="border-t border-line bg-card py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <SectionHeader id="faq-title" eyebrow="FAQ" title="Common questions" />
            <div className="mt-8 rounded-card border border-line bg-canvas p-6">
              <p className="text-sm font-medium text-muted">Starting from</p>
              <p className="mt-1 font-display text-3xl font-bold text-ink">{service.startingPrice}</p>
              <p className="mt-2 text-[15px]">{service.priceNote}. Custom quotes are always free.</p>
              <Link
                href="/pricing"
                className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-accent"
              >
                See all packages <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
          <FaqAccordion items={service.faqs} />
        </Container>
      </section>

      <ContactSection
        settings={settings}
        service={{ title: service.title, name: service.name }}
        title={`Get a quote for ${service.name}`}
      />
    </>
  );
}
