import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

/** Standard hero for inner pages: breadcrumbs, H1, intro and optional actions. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  children,
  className,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className={cn("border-b border-line pt-8 pb-14 md:pt-10 lg:pb-20", className)}>
      <Container>
        <Breadcrumbs items={crumbs} />
        <div
          className={cn(
            "mt-8 lg:mt-12",
            Boolean(aside) && "grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]",
          )}
        >
          <div className="max-w-3xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className={cn("heading-1", eyebrow && "mt-3")}>{title}</h1>
            {description && <p className="mt-5 max-w-2xl text-lg md:text-lead">{description}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside}
        </div>
      </Container>
    </section>
  );
}
