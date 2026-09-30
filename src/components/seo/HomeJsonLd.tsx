import { site, type SiteSettings } from "@/content/site";
import { founder } from "@/content/about";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/faqs";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "./JsonLd";

/** Organization, LocalBusiness and FAQPage structured data for the home page. */
export function HomeJsonLd({ settings, faqs }: { settings: SiteSettings; faqs: FaqItem[] }) {
  const url = absoluteUrl("/");
  const sameAs = Object.values(settings.social).filter(Boolean);
  const [city, ...rest] = settings.location.split(",").map((s) => s.trim());

  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${url}#organization`,
          name: site.name,
          url,
          logo: absoluteUrl("/icon.svg"),
          founder: {
            "@type": "Person",
            name: founder.name,
            jobTitle: founder.role,
            image: absoluteUrl(founder.photo),
          },
          email: settings.email,
          telephone: `+${settings.whatsappNumber}`,
          sameAs,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: settings.email,
            telephone: `+${settings.whatsappNumber}`,
            availableLanguage: ["English", "Urdu"],
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": `${url}#business`,
          name: site.name,
          url,
          image: absoluteUrl("/opengraph-image"),
          description: site.description,
          email: settings.email,
          telephone: `+${settings.whatsappNumber}`,
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressCountry: rest.at(-1) ?? "Pakistan",
          },
          areaServed: ["US", "GB", "AE", "PK"],
          sameAs,
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Services",
            itemListElement: services.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
            })),
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        },
      ]}
    />
  );
}
