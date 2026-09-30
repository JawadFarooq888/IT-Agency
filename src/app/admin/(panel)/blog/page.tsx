import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { buttonClasses } from "@/components/ui/button-styles";
import { AdminHeader } from "@/components/admin/ui";
import { ContentList } from "@/components/admin/ContentList";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
    include: { category: { select: { name: true } } },
  });
  return (
    <>
      <AdminHeader
        title="Blog"
        description="Posts are listed newest first on the website."
        actions={
          <Link href="/admin/blog/new" className={buttonClasses("primary", "sm")}>
            <Plus aria-hidden="true" className="size-4" /> New post
          </Link>
        }
      />
      <ContentList
        entity="blog"
        reorder={false}
        editHref={(id) => `/admin/blog/${id}`}
        empty="No posts yet."
        rows={posts.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: [
            p.category?.name,
            p.publishedAt ? p.publishedAt.toISOString().slice(0, 10) : "Not published",
          ]
            .filter(Boolean)
            .join(" · "),
          badge: p.status === "PUBLISHED" ? { label: "Published" } : { label: "Draft", muted: true },
        }))}
      />
    </>
  );
}
