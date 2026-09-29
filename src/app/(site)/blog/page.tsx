import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getCategories, getPosts } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button-styles";
import { PageHero } from "@/components/sections/PageHero";
import { PostCard } from "@/components/sections/PostCard";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Blog: Tips on Websites, Apps, AI and Growth",
  description:
    "Practical guides for small business owners and founders on websites, mobile apps, AI automation and digital marketing.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage(props: PageProps<"/blog">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const category = typeof sp.category === "string" ? sp.category : "";

  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const needle = q.toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (!category || p.category?.slug === category) &&
      (!needle || p.title.toLowerCase().includes(needle) || p.excerpt.toLowerCase().includes(needle)),
  );

  const chipHref = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  return (
    <>
      <PageHero
        crumbs={[{ name: "Blog", href: "/blog" }]}
        eyebrow="Blog"
        title="Practical advice for growing your business online"
        description="Short, clear guides on websites, apps, AI and marketing. No jargon."
      />

      <section aria-label="Articles" className="py-12 lg:py-20">
        <Container>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Blog categories">
              <ul className="flex flex-wrap gap-2">
                {[{ name: "All", slug: "" }, ...categories].map((c) => {
                  const active = category === c.slug;
                  return (
                    <li key={c.slug || "all"}>
                      <Link
                        href={chipHref(c.slug)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "inline-flex min-h-11 items-center rounded-full border px-4 text-[15px] font-medium transition-colors",
                          active ? "border-ink bg-ink text-white" : "border-line bg-card text-ink hover:border-ink/40",
                        )}
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <form role="search" action="/blog" className="flex w-full gap-2 lg:w-auto">
              {category && <input type="hidden" name="category" value={category} />}
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <div className="relative flex-1 lg:w-72">
                <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
                <input
                  id="blog-search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search articles"
                  className="block min-h-11 w-full rounded-btn border border-line bg-card pr-3 pl-10 text-ink placeholder:text-muted/80 focus:border-accent"
                />
              </div>
              <button type="submit" className={buttonClasses("dark", "sm")}>
                Search
              </button>
            </form>
          </div>

          {(q || category) && (
            <p className="mt-6 text-[15px] text-muted" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"} found
              {q && (
                <>
                  {" "}
                  for &ldquo;<span className="text-ink">{q}</span>&rdquo;
                </>
              )}
              .{" "}
              <Link href="/blog" className="font-medium text-accent underline underline-offset-4">
                Clear filters
              </Link>
            </p>
          )}

          {filtered.length > 0 ? (
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="card mt-8 p-10 text-center text-lg">No articles found. Try another search.</p>
          )}
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
