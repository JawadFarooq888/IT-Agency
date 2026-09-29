import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { buttonClasses } from "@/components/ui/button-styles";
import { AdminHeader } from "@/components/admin/ui";
import { ContentList } from "@/components/admin/ContentList";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const items = await db.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <>
      <AdminHeader
        title="Testimonials"
        description="Client reviews on the home page. The first 4 published ones are shown."
        actions={
          <Link href="/admin/testimonials/new" className={buttonClasses("primary", "sm")}>
            <Plus aria-hidden="true" className="size-4" /> New testimonial
          </Link>
        }
      />
      <ContentList
        entity="testimonial"
        editHref={(id) => `/admin/testimonials/${id}`}
        empty="No testimonials yet. Add real client reviews only."
        rows={items.map((t) => ({
          id: t.id,
          title: `${t.name}, ${t.company}`,
          subtitle: t.quote,
          badge: t.published ? { label: "Published" } : { label: "Hidden", muted: true },
        }))}
      />
    </>
  );
}
