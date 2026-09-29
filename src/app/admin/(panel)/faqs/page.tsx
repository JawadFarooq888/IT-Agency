import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { buttonClasses } from "@/components/ui/button-styles";
import { AdminHeader } from "@/components/admin/ui";
import { ContentList } from "@/components/admin/ContentList";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const items = await db.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <AdminHeader
        title="FAQs"
        description="Questions on the home page FAQ section. Service page FAQs live in src/content/services.ts."
        actions={
          <Link href="/admin/faqs/new" className={buttonClasses("primary", "sm")}>
            <Plus aria-hidden="true" className="size-4" /> New FAQ
          </Link>
        }
      />
      <ContentList
        entity="faq"
        editHref={(id) => `/admin/faqs/${id}`}
        empty="No FAQs yet."
        rows={items.map((f) => ({
          id: f.id,
          title: f.question,
          subtitle: f.answer,
          badge: f.published ? { label: "Published" } : { label: "Hidden", muted: true },
        }))}
      />
    </>
  );
}
