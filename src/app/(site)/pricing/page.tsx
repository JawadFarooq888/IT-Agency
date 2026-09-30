import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { pricing } from "@/content/pricing";
import { getService } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Starting prices for websites, mobile apps, AI chatbots and social media and SEO. Every project gets a free, fixed price quote.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Pricing", href: "/pricing" }]}
        eyebrow="Pricing"
        title="Simple starting prices, fixed quotes"
        description="These packages show where most projects start. Every project is different, so we always send a free, fixed price quote before any work begins."
      >
        <nav aria-label="Jump to pricing group">
          <ul className="flex flex-wrap gap-2">
            {pricing.map((g) => (
              <li key={g.service}>
                <a
                  href={`#${g.service}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-[15px] font-medium text-ink hover:border-ink/40"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {pricing.map((group, gi) => {
        const service = getService(group.service);
        return (
          <section
            key={group.service}
            id={group.service}
            aria-labelledby={`${group.service}-title`}
            className={cn("scroll-mt-24 py-16 lg:py-20", gi % 2 === 1 && "border-y border-line bg-card")}
          >
            <Container>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <h2 id={`${group.service}-title`} className="heading-2">
                  {group.title}
                </h2>
                {service && (
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent"
                  >
                    About this service <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                )}
              </div>
              <ul className="mt-10 grid gap-5 lg:grid-cols-3">
                {group.packages.map((p) => (
                  <li
                    key={p.name}
                    className={cn(
                      "relative flex flex-col rounded-card border p-7",
                      p.popular ? "border-ink bg-ink text-white" : "border-line bg-card",
                    )}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                        Most popular
                      </span>
                    )}
                    <h3 className={cn("heading-3", p.popular && "text-white")}>{p.name}</h3>
                    <p className={cn("mt-1 text-[15px]", p.popular ? "text-white/75" : "text-muted")}>
                      {p.description}
                    </p>
                    <p className={cn("mt-6 text-sm", p.popular ? "text-white/75" : "text-muted")}>
                      Starting from
                    </p>
                    <p
                      className={cn(
                        "font-display text-4xl font-bold tracking-tight",
                        p.popular ? "text-white" : "text-ink",
                      )}
                    >
                      {p.price}
                    </p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[15px]">
                          <Check
                            aria-hidden="true"
                            className={cn(
                              "mt-0.5 size-5 shrink-0",
                              p.popular ? "text-[#9DB4FF]" : "text-tint-green-ink",
                            )}
                          />
                          <span className={p.popular ? "text-white/90" : "text-ink"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact#quote"
                      className={buttonClasses(p.popular ? "light" : "outline", "md", "mt-8 w-full")}
                    >
                      Get a quote
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        );
      })}

      <section className="pb-4">
        <Container>
          <p className="card p-6 text-center text-lg">
            <strong className="text-ink">Custom quotes are always free.</strong> Need something not listed
            here, like desktop software, UI/UX design or cloud work?{" "}
            <Link href="/contact#quote" className="font-semibold text-accent underline underline-offset-4">
              Tell us about it
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
