import { clientLogos } from "@/content/home";
import { Container } from "@/components/ui/Container";

export function TrustStrip({ countriesLabel }: { countriesLabel: string }) {
  return (
    <section aria-label="Our clients" className="border-y border-line bg-card py-10">
      <Container>
        <p className="text-center text-sm font-medium text-muted">Trusted by clients in {countriesLabel}</p>
        {/* Replace these boxes with grayscale <Image> logos, e.g. className="grayscale opacity-70" */}
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {clientLogos.map((logo, i) => (
            <li
              key={i}
              className="grid h-14 place-items-center rounded-xl border border-dashed border-line text-sm text-muted grayscale"
            >
              {logo}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
