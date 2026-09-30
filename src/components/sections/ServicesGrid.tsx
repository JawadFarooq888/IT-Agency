import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { services } from "@/content/services";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button-styles";

/** 7 service cards + a dark "custom idea" card. 4 / 2 / 1 columns. */
export function ServicesGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {services.map((s, i) => (
        <Reveal as="li" key={s.slug} delay={(i % 4) * 60}>
          <Link
            href={`/services/${s.slug}`}
            className="card group flex h-full flex-col p-6 transition-colors hover:border-ink/25"
          >
            <IconBadge icon={s.icon} tint={s.tint} />
            <h3 className="heading-3 mt-5">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed">{s.benefit}</p>
            <ul className="mt-5 flex flex-1 flex-wrap content-start gap-1.5" aria-label="Technologies">
              {s.tags.slice(0, 4).map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">
              Learn more
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </Reveal>
      ))}
      <Reveal as="li" delay={180}>
        <div className="flex h-full flex-col rounded-card bg-ink p-6 text-white">
          <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-white">
            <Sparkles aria-hidden="true" className="size-6" />
          </span>
          <h3 className="heading-3 mt-5 text-white">Have a custom idea?</h3>
          <p className="mt-2 flex-1 text-[15px] leading-relaxed text-white/75">
            Not sure which service you need? Tell us the problem and we will suggest the simplest way to solve
            it.
          </p>
          <Link href="/contact#quote" className={buttonClasses("light", "md", "mt-6 self-start")}>
            Let&apos;s talk <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Reveal>
    </ul>
  );
}
