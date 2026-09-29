import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, UserRound } from "lucide-react";
import { site } from "@/content/site";
import { getPost, getPosts } from "@/lib/content";
import { readingTime, renderMarkdown } from "@/lib/markdown";
import { absoluteUrl } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonClasses } from "@/components/ui/button-styles";
import { WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostCard, formatDate } from "@/components/sections/PostCard";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: post.authorName }],
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { html, toc } = renderMarkdown(post.content);
  const minutes = readingTime(post.content);
  const all = await getPosts();
  const related = [
    ...all.filter((p) => p.slug !== post.slug && p.category?.slug === post.category?.slug),
    ...all.filter((p) => p.slug !== post.slug && p.category?.slug !== post.category?.slug),
  ].slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          author: { "@type": "Person", name: post.authorName },
          publisher: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          ...(post.coverImage ? { image: [post.coverImage] } : {}),
        }}
      />

      <article>
        <header className="border-b border-line pt-8 pb-12 md:pt-10 lg:pb-16">
          <Container>
            <Breadcrumbs
              items={[
                { name: "Blog", href: "/blog" },
                { name: post.title, href: `/blog/${post.slug}` },
              ]}
            />
            <div className="mt-8 max-w-3xl lg:mt-12">
              {post.category && (
                <Link href={`/blog?category=${post.category.slug}`} className="eyebrow hover:underline">
                  {post.category.name}
                </Link>
              )}
              <h1 className="heading-1 mt-3">{post.title}</h1>
              <p className="mt-5 text-lg md:text-lead">{post.excerpt}</p>
              <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-muted">
                <span className="inline-flex items-center gap-2">
                  <UserRound aria-hidden="true" className="size-4" /> {post.authorName}
                </span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span className="inline-flex items-center gap-2">
                  <Clock aria-hidden="true" className="size-4" /> {minutes} min read
                </span>
              </p>
            </div>
          </Container>
        </header>

        <Container className="py-12 lg:py-16">
          {post.coverImage && (
            <div className="relative mb-12 aspect-[16/8] overflow-hidden rounded-card border border-line">
              <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 1440px) 1248px, 100vw" className="object-cover" />
            </div>
          )}
          <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,720px)] xl:gap-20">
            {toc.length > 0 && (
              <nav aria-labelledby="toc-title" className="lg:sticky lg:top-24 lg:self-start">
                <h2 id="toc-title" className="text-sm font-semibold tracking-wide text-ink uppercase">
                  On this page
                </h2>
                <ol className="mt-4 space-y-1 border-l border-line text-[15px]">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className={`-ml-px block border-l border-transparent py-1.5 text-muted hover:border-accent hover:text-accent ${t.level === 3 ? "pl-7" : "pl-4"}`}
                      >
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className={toc.length === 0 ? "lg:col-start-2" : undefined}>
              <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

              <aside aria-label="Get help with your project" className="mt-14 rounded-card bg-ink p-8 md:p-10">
                <h2 className="heading-3 text-2xl text-white">Need help with your project?</h2>
                <p className="mt-3 text-white/75">
                  Tell us what you want to build. We will reply within 24 hours with ideas and a free,
                  fixed price quote.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact#quote" className={buttonClasses("light", "md")}>
                    Get a free quote <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <WhatsAppLink className={buttonClasses("outline-light", "md")}>
                    <WhatsAppIcon className="size-5" /> Chat on WhatsApp
                  </WhatsAppLink>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-card py-16 lg:py-24">
          <Container>
            <h2 id="related-title" className="heading-2">
              Related articles
            </h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
