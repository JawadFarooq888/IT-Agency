import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { buttonClasses } from "@/components/ui/button-styles";
import { AdminHeader } from "@/components/admin/ui";
import { ContentList } from "@/components/admin/ContentList";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const items = await db.portfolioItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <>
      <AdminHeader
        title="Portfolio"
        description="Case studies shown on the home page and /portfolio, in this order."
        actions={
          <Link href="/admin/portfolio/new" className={buttonClasses("primary", "sm")}>
            <Plus aria-hidden="true" className="size-4" /> New case study
          </Link>
        }
      />
      <ContentList
        entity="portfolio"
        editHref={(id) => `/admin/portfolio/${id}`}
        empty="No case studies yet."
        rows={items.map((i) => ({
          id: i.id,
          title: i.title,
          subtitle: `${i.client} · ${i.industry} · ${i.category}`,
          badge: i.published ? { label: "Published" } : { label: "Hidden", muted: true },
        }))}
      />
    </>
  );
}
