import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { founder, mission, story, team, values } from "@/content/about";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button-styles";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { LinkedInIcon } from "@/components/ui/BrandIcons";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the team behind TechApp Solutions. We help small businesses and startups grow with websites, apps, AI tools and digital marketing.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const firstName = founder.name.split(" ")[0];
  const numbers = [
    { value: settings.stats.projects, label: "Projects delivered" },
    { value: settings.stats.rating, label: "Upwork rating" },
    { value: "[4]", label: "Countries served" },
    { value: settings.stats.replyTime, label: "Average reply time" },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ name: "About", href: "/about" }]}
        eyebrow="About us"
        title="A small team that helps small businesses grow"
        description="We build websites, apps and AI tools for business owners who want clear prices, honest advice and results they can measure."
      />

      <section aria-labelledby="story-title" className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader id="story-title" eyebrow="Our story" title="How we started" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed">
              {story.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-card bg-ink p-8 md:p-12">
            <p className="eyebrow text-[#9DB4FF]">Our mission</p>
            <p className="mt-4 font-display text-2xl leading-snug font-semibold text-white md:text-3xl">
              {mission}
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="founder-title" className="pb-16 lg:pb-24">
        <Container className="grid items-center gap-10 md:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-card border border-line bg-canvas md:max-w-none">
            <Image
              src={founder.photo}
              alt={`${founder.name}, ${founder.role}`}
              fill
              sizes="(min-width: 768px) 380px, 90vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="eyebrow">Meet the founder</p>
            <h2 id="founder-title" className="heading-2 mt-3">
              {founder.name}
            </h2>
            <p className="mt-2 text-lg font-medium text-accent">{founder.role}</p>
            <div className="mt-6 space-y-4 text-lg leading-relaxed">
              {founder.message.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookCallButton className={buttonClasses("primary", "lg")}>
                <CalendarDays aria-hidden="true" className="size-5" /> Book a call with {firstName}
              </BookCallButton>
              {settings.social.linkedin && (
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("outline", "lg")}
                >
                  <LinkedInIcon className="size-5" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Our numbers" className="border-y border-line bg-card py-12">
        <Container>
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse justify-end text-center">
                <dt className="mt-1 text-[15px] text-muted">{n.label}</dt>
                <dd className="font-display text-4xl font-bold tracking-tight text-ink">{n.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="values-title" className="py-16 lg:py-24">
        <Container>
          <SectionHeader id="values-title" eyebrow="Our values" title="What we care about" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 70} className="card p-6">
                <IconBadge icon={v.icon} tint={v.tint} />
                <h3 className="heading-3 mt-5">{v.title}</h3>
                <p className="mt-2 text-[15px]">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="team-title" className="border-t border-line bg-card py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader id="team-title" eyebrow="Our team" title="The people you will work with" />
            <Link href="/contact" className={buttonClasses("outline", "md", "self-start md:self-auto")}>
              Talk to us <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <li key={i} className="overflow-hidden rounded-card border border-line bg-canvas">
                <div className="relative aspect-square bg-canvas">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={`Photo of ${m.name}`}
                      fill
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-muted">
                      <span className="flex flex-col items-center gap-2 text-sm">
                        <UserRound aria-hidden="true" className="size-10" /> [Team photo]
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t border-line bg-card p-5">
                  <h3 className="heading-3">{m.name}</h3>
                  <p className="mt-1 text-[15px] text-muted">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner title="Let's build something together" />
    </>
  );
}
