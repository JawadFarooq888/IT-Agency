import { ArrowRight, CalendarDays, Mail } from "lucide-react";
import type { SiteSettings } from "@/content/site";
import { CalendlyButton } from "@/components/ui/CalendlyButton";
import { EmailLink, WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

const cardClass = "card group flex items-center gap-4 p-5 transition-colors hover:border-ink/25 md:p-6";

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="ml-auto size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
    />
  );
}

/** WhatsApp, email and booking cards. `service` names the service in the WhatsApp message. */
export function ContactCards({ settings, service }: { settings: SiteSettings; service?: string }) {
  return (
    <ul className="space-y-3">
      <li>
        <WhatsAppLink service={service} className={cardClass}>
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-tint-green text-tint-green-ink">
            <WhatsAppIcon className="size-6" />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-ink">Chat on WhatsApp</span>
            <span className="block text-[15px] text-muted">{settings.whatsappDisplay}</span>
          </span>
          <Arrow />
        </WhatsAppLink>
      </li>
      <li>
        <EmailLink className={cardClass}>
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-tint-blue text-tint-blue-ink">
            <Mail aria-hidden="true" className="size-6" />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-ink">Email us</span>
            <span className="block truncate text-[15px] text-muted">{settings.email}</span>
          </span>
          <Arrow />
        </EmailLink>
      </li>
      <li>
        <CalendlyButton className={cardClass}>
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-tint-orange text-tint-orange-ink">
            <CalendarDays aria-hidden="true" className="size-6" />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-ink">Book a call</span>
            <span className="block text-[15px] text-muted">Free 20 minute video call</span>
          </span>
          <Arrow />
        </CalendlyButton>
      </li>
    </ul>
  );
}
