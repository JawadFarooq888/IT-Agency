import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import type { BlogPostView } from "@/content/blog";
import { readingTime } from "@/lib/markdown";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function PostCard({ post }: { post: BlogPostView }) {
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-colors hover:border-ink/25">
      <div className="relative aspect-[16/9] border-b border-line bg-canvas">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <FileText aria-hidden="true" className="size-8" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          {post.category && <span className="font-semibold text-accent">{post.category.name}</span>}
          {post.category && <span aria-hidden="true">·</span>}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.content)} min read</span>
        </p>
        <h3 className="heading-3 mt-3">
          <Link href={`/blog/${post.slug}`} className="group-hover:text-accent after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed">{post.excerpt}</p>
      </div>
    </article>
  );
}
