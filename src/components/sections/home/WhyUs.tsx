import { whyUs } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeader
          id="why-title"
          eyebrow="Why choose us"
          title="Simple to work with, from first call to launch"
          description="We keep things clear and predictable, so you can focus on running your business."
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {whyUs.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70} className="card p-6">
              <IconBadge icon={item.icon} tint={item.tint} />
              <h3 className="heading-3 mt-5">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
