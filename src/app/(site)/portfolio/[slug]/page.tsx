import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ImageIcon, Quote } from "lucide-react";
import { getService } from "@/content/services";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button-styles";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioCard } from "@/components/sections/PortfolioCard";
import { CtaBanner } from "@/components/sections/CtaBanner";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getCaseStudy(slug);
  if (!item) return {};
  return {
    title: `${item.title} Case Study`,
    description: item.summary,
    alternates: { canonical: `/portfolio/${item.slug}` },
    openGraph: item.coverImage ? { images: [item.coverImage] } : undefined,
  };
}

export default async function CaseStudyPage(props: PageProps<"/portfolio/[slug]">) {
  const { slug } = await props.params;
  const item = await getCaseStudy(slug);
  if (!item) notFound();

  const more = (await getCaseStudies()).filter((c) => c.slug !== item.slug).slice(0, 3);
  const serviceNames = item.services.map((s) => getService(s)).filter((s) => s !== undefined);
  const facts = [
    { label: "Client", value: item.client },
    { label: "Industry", value: item.industry },
    { label: "Country", value: item.country },
    { label: "Services", value: serviceNames.map((s) => s.title).join(", ") },
  ];
  const gallery = item.gallery.length > 0 ? item.gallery : [null, null];

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Our Work", href: "/portfolio" },
          { name: item.title, href: `/portfolio/${item.slug}` },
        ]}
        eyebrow="Case study"
        title={item.title}
        description={item.summary}
      >
        <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="mt-1 font-medium text-ink">{f.value || "-"}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="py-12 lg:py-16">
        <Container>
          <div className="relative aspect-[16/8] overflow-hidden rounded-card border border-line bg-card">
            {item.coverImage ? (
              <Image
                src={item.coverImage}
                alt={`${item.title} main screenshot`}
                fill
                priority
                sizes="(min-width: 1440px) 1248px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-muted">
                <span className="flex flex-col items-center gap-2">
                  <ImageIcon aria-hidden="true" className="size-8" /> [Main project screenshot]
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section aria-label="Project details" className="pb-16 lg:pb-24">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="space-y-12">
            <div>
              <h2 className="heading-2">The problem</h2>
              <p className="mt-4 text-lg leading-relaxed">{item.problem}</p>
            </div>
            <div>
              <h2 className="heading-2">Our solution</h2>
              <p className="mt-4 text-lg leading-relaxed">{item.solution}</p>
            </div>
            <div>
              <h2 className="heading-2">Results</h2>
              <ul className="mt-5 space-y-3">
                {item.results.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-lg text-ink">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-tint-green text-tint-green-ink">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="heading-2">Gallery</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {gallery.map((src, i) => (
                  <li
                    key={src ?? i}
                    className="relative aspect-[4/3] overflow-hidden rounded-card-sm border border-line bg-card"
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={`${item.title} screenshot ${i + 1}`}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-muted">
                        [Screenshot {i + 1}]
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="heading-3">Tech used</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[15px] text-ink"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {item.testimonial && (
              <figure className="rounded-card bg-ink p-6 text-white">
                <Quote aria-hidden="true" className="size-6 text-[#9DB4FF]" />
                <blockquote className="mt-3 text-[17px] leading-relaxed text-white/90">
                  <p>{item.testimonial.quote}</p>
                </blockquote>
                <figcaption className="mt-4 text-sm text-white/75">
                  <span className="block font-semibold text-white">{item.testimonial.name}</span>
                  {item.testimonial.role}
                </figcaption>
              </figure>
            )}
            <div className="card p-6">
              <h2 className="heading-3">Need something similar?</h2>
              <p className="mt-2 text-[15px]">
                Tell us about your project and get a free quote within 24 hours.
              </p>
              <Link href="/contact#quote" className={buttonClasses("primary", "md", "mt-5 w-full")}>
                Get a free quote <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </aside>
        </Container>
      </section>

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="border-t border-line bg-card py-16 lg:py-24">
          <Container>
            <h2 id="more-title" className="heading-2">
              More projects
            </h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {more.map((c) => (
                <li key={c.slug}>
                  <PortfolioCard item={c} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
