import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { buttonClasses } from "@/components/ui/button-styles";
import { AdminHeader } from "@/components/admin/ui";
import { ContentList } from "@/components/admin/ContentList";

export const metadata: Metadata = { title: "Team" };

export default async function AdminTeamPage() {
  const items = await db.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <AdminHeader
        title="Team"
        description="People on the About page, in this order. The member marked as founder also gets the big founder section."
        actions={
          <Link href="/admin/team/new" className={buttonClasses("primary", "sm")}>
            <Plus aria-hidden="true" className="size-4" /> New member
          </Link>
        }
      />
      <ContentList
        entity="team"
        editHref={(id) => `/admin/team/${id}`}
        empty="No team members yet. Add yourself first, then the people clients will work with."
        rows={items.map((m) => ({
          id: m.id,
          title: m.name,
          subtitle: [m.role, m.email, m.phone].filter(Boolean).join(" · "),
          badge: !m.published
            ? { label: "Hidden", muted: true }
            : m.featured
              ? { label: "Founder" }
              : { label: "Published" },
        }))}
      />
    </>
  );
}
