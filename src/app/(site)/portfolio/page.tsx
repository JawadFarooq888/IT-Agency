import type { Metadata } from "next";
import { getCaseStudies } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioFilter } from "@/components/sections/PortfolioFilter";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Our Work: Case Studies",
  description:
    "Websites, mobile apps and AI tools we have built for small businesses and startups, with the problem we solved and the result.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const items = await getCaseStudies();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Our Work", href: "/portfolio" }]}
        eyebrow="Our work"
        title="Projects that solved real business problems"
        description="Every case study shows the problem the client had, what we built and the result. Filter by type to find work like yours."
      />
      <section aria-label="Case studies" className="py-16 lg:py-24">
        <Container>
          <PortfolioFilter items={items} />
        </Container>
      </section>
      <CtaBanner title="Want results like these?" />
    </>
  );
}
