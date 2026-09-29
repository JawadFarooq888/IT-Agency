import { Quote } from "lucide-react";
import type { TestimonialItem } from "@/content/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title" className="bg-ink py-20 lg:py-28">
      <Container>
        <SectionHeader
          id="testimonials-title"
          dark
          eyebrow="Client reviews"
          title="What our clients say"
          description="Real feedback from business owners and founders we have worked with."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 4).map((t, i) => (
            <Reveal as="li" key={i} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-card border border-white/10 bg-ink-soft p-7">
                <Quote aria-hidden="true" className="size-7 text-[#9DB4FF]" />
                <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed text-white/90">
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-5">
                  <span className="block font-semibold text-white">{t.name}</span>
                  <span className="mt-0.5 block text-sm text-white/70">
                    {t.role}, {t.company} · {t.country}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
