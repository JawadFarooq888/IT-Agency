"use client";

import { useState } from "react";
import { portfolioCategories, type CaseStudy } from "@/content/portfolio";
import { cn } from "@/lib/utils";
import { PortfolioCard } from "./PortfolioCard";

/** Filter chips + grid. `limit` caps how many cards show (home preview). */
export function PortfolioFilter({ items, limit }: { items: CaseStudy[]; limit?: number }) {
  const [active, setActive] = useState<(typeof portfolioCategories)[number]["value"]>("all");
  const filtered = items.filter((i) => active === "all" || i.category === active);
  const shown = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {portfolioCategories.map((c) => (
          <button
            key={c.value}
            type="button"
            aria-pressed={active === c.value}
            onClick={() => setActive(c.value)}
            className={cn(
              "min-h-11 rounded-full border px-5 text-[15px] font-medium transition-colors",
              active === c.value
                ? "border-ink bg-ink text-white"
                : "border-line bg-card text-ink hover:border-ink/40",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} projects
      </p>
      {shown.length > 0 ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <li key={item.slug}>
              <PortfolioCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="card mt-8 p-8 text-center">No projects in this category yet.</p>
      )}
    </div>
  );
}
