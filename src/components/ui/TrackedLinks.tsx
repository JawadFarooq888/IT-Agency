"use client";

import { trackEvent } from "@/lib/analytics";
import { whatsappMessage, whatsappUrl } from "@/lib/utils";
import { useSettings } from "@/components/providers/SettingsProvider";

type BaseProps = {
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

/** WhatsApp link with a pre-filled message. Pass `service` to name it in the message. */
export function WhatsAppLink({
  service,
  message,
  className,
  children,
  ...rest
}: BaseProps & { service?: string; message?: string }) {
  const { whatsappNumber } = useSettings();
  const href = whatsappUrl(whatsappNumber, message ?? whatsappMessage(service));
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("whatsapp_click", service ? { service } : undefined)}
      {...rest}
    >
      {children}
    </a>
  );
}

export function EmailLink({ className, children, ...rest }: BaseProps) {
  const { email } = useSettings();
  return (
    <a href={`mailto:${email}`} className={className} onClick={() => trackEvent("email_click")} {...rest}>
      {children}
    </a>
  );
}
