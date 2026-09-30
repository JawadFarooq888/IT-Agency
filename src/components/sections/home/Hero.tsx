import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";
import type { SiteSettings } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button-styles";
import { WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function Hero({ settings }: { settings: SiteSettings }) {
  const stats = [
    { value: settings.stats.projects, label: "projects delivered" },
    { value: settings.stats.rating, label: "Upwork rating" },
    { value: settings.stats.replyTime, label: "reply time" },
  ];

  return (
    <section className="overflow-hidden pt-10 pb-16 md:pt-16 lg:pt-20 lg:pb-24">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-ink">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
            Software, AI and digital growth under one roof
          </p>
          <h1 className="heading-1 mt-6">
            We build the websites, apps and AI tools that grow your business.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-body md:text-lead">
            One team for your website, mobile app, AI chatbot and marketing. Fixed price quotes, weekly
            updates and a reply within 24 hours.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#quote" className={buttonClasses("primary", "lg")}>
              Get a free quote <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <WhatsAppLink className={buttonClasses("whatsapp", "lg")}>
              <WhatsAppIcon className="size-5" /> Chat on WhatsApp
            </WhatsAppLink>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-2xl font-bold tracking-tight text-ink md:text-[32px]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroMockup />
      </Container>
    </section>
  );
}

/** Browser window + phone built with CSS only (no images). */
function HeroMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[560px] pb-10 lg:pb-0">
      {/* Browser window */}
      <div className="card overflow-hidden shadow-float">
        <div className="flex items-center gap-2 border-b border-line bg-canvas px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#E4E2DA]" />
          <span className="size-2.5 rounded-full bg-[#E4E2DA]" />
          <span className="size-2.5 rounded-full bg-[#E4E2DA]" />
          <span className="ml-3 h-6 flex-1 rounded-md border border-line bg-card" />
        </div>
        <div className="p-5 md:p-7">
          <div className="flex items-center justify-between">
            <span className="h-3 w-20 rounded-full bg-ink" />
            <span className="flex gap-2">
              <span className="h-2 w-10 rounded-full bg-line" />
              <span className="h-2 w-10 rounded-full bg-line" />
              <span className="h-2 w-10 rounded-full bg-line" />
            </span>
          </div>
          <div className="mt-8 space-y-2.5">
            <span className="block h-4 w-4/5 rounded-full bg-ink" />
            <span className="block h-4 w-3/5 rounded-full bg-ink" />
            <span className="block h-2.5 w-2/3 rounded-full bg-line" />
          </div>
          <div className="mt-5 flex gap-2">
            <span className="h-8 w-24 rounded-lg bg-accent" />
            <span className="h-8 w-20 rounded-lg border border-line" />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <span className="h-20 rounded-xl bg-tint-blue" />
            <span className="h-20 rounded-xl bg-tint-orange" />
            <span className="h-20 rounded-xl bg-tint-green" />
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="absolute -bottom-2 -left-2 w-[128px] rounded-[26px] border-[5px] border-ink bg-card p-2.5 shadow-float sm:-left-6 sm:w-[150px] lg:-bottom-10">
        <span className="mx-auto block h-1.5 w-10 rounded-full bg-ink/80" />
        <div className="mt-3 space-y-2">
          <span className="block h-2.5 w-3/4 rounded-full bg-ink" />
          <span className="block h-2 w-1/2 rounded-full bg-line" />
        </div>
        <span className="mt-3 block h-16 rounded-xl bg-tint-blue" />
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <span className="h-10 rounded-lg bg-tint-orange" />
          <span className="h-10 rounded-lg bg-tint-green" />
        </div>
        <span className="mt-2.5 block h-6 rounded-lg bg-accent" />
      </div>

      {/* Floating chatbot card */}
      <div className="absolute -top-5 right-0 flex max-w-[240px] items-center gap-3 rounded-card-sm border border-line bg-card p-3 shadow-float-sm sm:-right-4 md:top-auto md:bottom-10 lg:-right-8">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-green text-tint-green-ink">
          <Bot className="size-5" />
        </span>
        <span className="text-sm leading-snug">
          <span className="flex items-center gap-1 font-semibold text-ink">
            AI chatbot live <CheckCircle2 className="size-4 text-whatsapp" />
          </span>
          <span className="text-muted">Answering leads 24/7</span>
        </span>
      </div>
    </div>
  );
}
