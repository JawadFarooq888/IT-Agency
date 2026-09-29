import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button-styles";

export function NotFoundContent() {
  return (
    <Container className="py-20 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-6xl font-bold tracking-tight text-accent">404</p>
        <h1 className="heading-2 mt-4">We could not find that page</h1>
        <p className="mt-4 text-lg">
          The page may have moved or the link may be wrong. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonClasses("primary", "lg")}>
            Back to home
          </Link>
          <Link href="/contact#quote" className={buttonClasses("outline", "lg")}>
            Get a free quote
          </Link>
        </div>
        <ul className="mt-12 grid gap-2 text-left sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="card flex min-h-12 items-center justify-between px-4 py-3 font-medium text-ink hover:border-ink/25"
              >
                {s.title} <ArrowRight aria-hidden="true" className="size-4 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
