import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button-styles";
import { WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/** Dark call-to-action band used at the bottom of inner pages. */
export function CtaBanner({
  title = "Ready to start your project?",
  description = "Tell us what you need. You get a free, fixed price quote within 24 hours.",
  service,
}: {
  title?: string;
  description?: string;
  /** Service name for the WhatsApp message */
  service?: string;
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-col gap-8 rounded-card bg-ink p-8 md:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div className="max-w-2xl">
            <h2 className="heading-2 text-white">{title}</h2>
            <p className="mt-4 text-lg text-white/75">{description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Link href="/contact#quote" className={buttonClasses("light", "lg")}>
              Get a free quote <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <WhatsAppLink service={service} className={buttonClasses("outline-light", "lg")}>
              <WhatsAppIcon className="size-5" /> Chat on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
