import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { processSteps } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonClasses } from "@/components/ui/button-styles";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Services: Web, Mobile, AI, Cloud and Marketing",
  description:
    "Web development, mobile apps, desktop software, UI/UX design, AI automation, database and cloud, and social media and SEO for small businesses and startups.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", href: "/services" }]}
        eyebrow="Services"
        title="One team for your software, AI and growth"
        description="Choose a single service or let us handle the whole project, from design to launch and marketing. Every project starts with a free, fixed price quote."
      >
        <Link href="/contact#quote" className={buttonClasses("primary", "lg")}>
          Get a free quote <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      </PageHero>

      <section aria-labelledby="all-services" className="py-16 lg:py-24">
        <Container>
          <h2 id="all-services" className="sr-only">
            All services
          </h2>
          <ServicesGrid />
        </Container>
      </section>

      <section aria-labelledby="process-title" className="border-y border-line bg-card py-16 lg:py-24">
        <Container>
          <SectionHeader
            id="process-title"
            eyebrow="How we work"
            title="The same clear process for every service"
          />
          <div className="mt-10">
            <ProcessSteps steps={processSteps} />
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
