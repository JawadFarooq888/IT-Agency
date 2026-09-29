import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import type { CaseStudy } from "@/content/portfolio";

const categoryLabel = { web: "Web", mobile: "Mobile", ai: "AI", other: "Other" } as const;

export function PortfolioCard({ item }: { item: CaseStudy }) {
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-colors hover:border-ink/25">
      <div className="relative aspect-[16/10] border-b border-line bg-canvas">
        {item.coverImage ? (
          <Image
            src={item.coverImage}
            alt={`${item.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">
            <span className="flex flex-col items-center gap-2">
              <ImageIcon aria-hidden="true" className="size-6" />
              [Project screenshot]
            </span>
          </div>
        )}
        <span className="absolute top-4 left-4 rounded-full bg-card px-3 py-1 text-xs font-semibold text-ink">
          {categoryLabel[item.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted">
          {item.industry} · {item.country}
        </p>
        <h3 className="heading-3 mt-2">
          <Link href={`/portfolio/${item.slug}`} className="after:absolute after:inset-0 hover:text-accent">
            {item.title}
          </Link>
        </h3>
        <dl className="mt-4 flex-1 space-y-3 text-[15px]">
          <div>
            <dt className="font-semibold text-ink">Problem</dt>
            <dd className="mt-0.5">{item.problem}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Result</dt>
            <dd className="mt-0.5">{item.result}</dd>
          </div>
        </dl>
        <span className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-accent">
          Read case study <ArrowUpRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </article>
  );
}
