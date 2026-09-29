import { Reveal } from "@/components/ui/Reveal";

export function ProcessSteps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 70} className="card relative p-6">
          <span className="font-display text-sm font-semibold text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="heading-3 mt-3">{step.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed">{step.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
