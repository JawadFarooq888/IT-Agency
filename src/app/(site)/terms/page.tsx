import type { Metadata } from "next";
import { site } from "@/content/site";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you use the ${site.name} website and services.`,
  alternates: { canonical: "/terms" },
};

// Template only. Have it reviewed for your business and the countries you serve.
export default async function TermsPage() {
  const { email } = await getSiteSettings();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Terms of Service", href: "/terms" }]}
        title="Terms of Service"
        description="Last updated: [Month DD, YYYY]"
      />
      <Container className="py-12 lg:py-16">
        <div className="prose">
          <p>
            These terms apply to your use of {site.domain} and to services provided by [{site.name} legal
            company name]. Each project is also covered by a written proposal or contract, which takes
            priority if there is a conflict.
          </p>

          <h2>Quotes and proposals</h2>
          <p>
            Quotes are free and valid for [30] days. A project starts once you accept the proposal and pay the
            first milestone.
          </p>

          <h2>Payments</h2>
          <p>
            Payments are made in milestones as set out in your proposal. Invoices are due within [7] days. We
            accept [bank transfer, Wise, Payoneer, PayPal] and Upwork.
          </p>

          <h2>Changes to scope</h2>
          <p>
            Work outside the agreed scope is quoted separately. We will always confirm extra costs with you in
            writing before starting.
          </p>

          <h2>Ownership</h2>
          <p>
            When the project is paid in full, you own the final code, designs and content we create for you.
            Third-party tools, themes and licences remain subject to their own terms.
          </p>

          <h2>Confidentiality</h2>
          <p>We keep your business information confidential and will sign an NDA on request.</p>

          <h2>Support and warranty</h2>
          <p>
            We fix bugs reported within [30] days of launch at no cost. Ongoing support and new features are
            available under a separate plan.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the extent allowed by law, our total liability for any claim is limited to the amount you paid
            for the project concerned. We are not liable for indirect losses such as lost profits.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of [country / state].</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
