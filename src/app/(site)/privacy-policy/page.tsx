import type { Metadata } from "next";
import { site } from "@/content/site";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy-policy" },
};

// Template only. Have it reviewed for your business and the countries you serve.
export default async function PrivacyPolicyPage() {
  const { email, location } = await getSiteSettings();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Privacy Policy", href: "/privacy-policy" }]}
        title="Privacy Policy"
        description="Last updated: [Month DD, YYYY]"
      />
      <Container className="py-12 lg:py-16">
        <div className="prose">
          <p>
            This Privacy Policy explains how [{site.name} legal company name] (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;) collects, uses and protects your information when you visit {site.domain} or
            contact us.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Information you give us:</strong> your name, email, phone or WhatsApp number, company
              name, project details and any files you upload through our quote form.
            </li>
            <li>
              <strong>Usage information:</strong> pages visited, referring website, campaign (UTM) tags,
              device and browser type, collected through Google Analytics and similar tools.
            </li>
            <li>
              <strong>Technical data:</strong> a one-way hashed version of your IP address, used only to
              prevent spam.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To reply to your enquiry and prepare a quote.</li>
            <li>To deliver and support the services you buy from us.</li>
            <li>To improve our website and understand which pages are useful.</li>
            <li>To protect our website against spam and abuse.</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2>Legal basis</h2>
          <p>
            We process your data based on your consent (when you submit the form), to take steps before
            entering a contract with you, and for our legitimate interests in running and protecting our
            business.
          </p>

          <h2>Service providers</h2>
          <p>We share data only with providers that help us run our business, including:</p>
          <ul>
            <li>[Vercel] (website hosting and file storage)</li>
            <li>[Neon] (database hosting)</li>
            <li>[Resend] (email delivery)</li>
            <li>[Google Analytics] (website analytics)</li>
            <li>[Cloudflare Turnstile] (spam protection)</li>
          </ul>

          <h2>How long we keep data</h2>
          <p>
            We keep enquiry data for up to [24 months] after our last contact, unless we have an ongoing
            contract or a legal reason to keep it longer.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to access, correct, delete or export your
            data, and to object to or restrict how we use it. To make a request, email us at{" "}
            <a href={`mailto:${email}`}>{email}</a>.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies for analytics and to keep the admin area secure. You can block cookies in your
            browser settings. [Describe your cookie banner here if you use one.]
          </p>

          <h2>Contact</h2>
          <p>
            [{site.name} legal company name], {location}. Email: <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
