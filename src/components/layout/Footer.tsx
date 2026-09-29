import Link from "next/link";
import { CalendarDays, Mail, MapPin } from "lucide-react";
import { services } from "@/content/services";
import { site, type SiteSettings } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CalendlyButton } from "@/components/ui/CalendlyButton";
import { EmailLink, WhatsAppLink } from "@/components/ui/TrackedLinks";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  UpworkIcon,
  WhatsAppIcon,
} from "@/components/ui/BrandIcons";

const companyLinks = [
  { href: "/about", label: "About us" },
  { href: "/portfolio", label: "Our work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

const linkClass = "inline-flex min-h-11 items-center text-white/75 hover:text-white md:min-h-9";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.social.upwork, label: "Upwork", Icon: UpworkIcon },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-white">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-white/75">{site.shortDescription}</p>
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white hover:text-white"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-base font-semibold text-white">Services</h2>
            <ul className="mt-4 space-y-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={linkClass}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-base font-semibold text-white">Company</h2>
            <ul className="mt-4 space-y-1">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-base font-semibold text-white">Contact</h2>
            <ul className="mt-4 space-y-1">
              <li>
                <WhatsAppLink className={`${linkClass} gap-3`}>
                  <WhatsAppIcon className="size-[18px] shrink-0" />
                  {settings.whatsappDisplay}
                </WhatsAppLink>
              </li>
              <li>
                <EmailLink className={`${linkClass} gap-3 break-all`}>
                  <Mail aria-hidden="true" className="size-[18px] shrink-0" />
                  {settings.email}
                </EmailLink>
              </li>
              <li>
                <CalendlyButton className={`${linkClass} gap-3`}>
                  <CalendarDays aria-hidden="true" className="size-[18px] shrink-0" />
                  Book a 20 minute call
                </CalendlyButton>
              </li>
              <li className="flex min-h-11 items-center gap-3 text-white/75 md:min-h-9">
                <MapPin aria-hidden="true" className="size-[18px] shrink-0" />
                {settings.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Working with clients in {settings.countriesLabel}.</p>
        </div>
      </Container>
    </footer>
  );
}
