import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/utils";

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail plus BreadcrumbList JSON-LD. Home is added automatically. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="inline-flex min-h-8 items-center hover:text-accent">
                      {c.name}
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  );
}
