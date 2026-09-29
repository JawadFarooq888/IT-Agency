"use client";

import { usePathname } from "next/navigation";
import { getService } from "@/content/services";
import { WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/** Fixed WhatsApp button. On service pages the message names that service. */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  const slug = pathname.match(/^\/services\/([^/]+)/)?.[1];
  const service = slug ? getService(slug) : undefined;

  return (
    <WhatsAppLink
      service={service?.name}
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-float transition-transform duration-200 hover:scale-105 hover:bg-whatsapp-hover md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </WhatsAppLink>
  );
}
