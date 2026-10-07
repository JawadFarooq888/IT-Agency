import "server-only";
import { cache } from "react";
import { db, isDbConfigured } from "./db";
import { defaultCaseStudies, type CaseStudy } from "@/content/portfolio";
import { defaultTestimonials, type TestimonialItem } from "@/content/testimonials";
import { defaultFaqs, type FaqItem } from "@/content/faqs";
import { defaultTeam, type TeamMember } from "@/content/about";
import { defaultCategories, defaultPosts, type BlogCategory, type BlogPostView } from "@/content/blog";
import type { PortfolioCategory, ServiceSlug } from "@/content/services";

/**
 * Loaders for content that is editable in the admin panel.
 * They read from the database, and fall back to the static files in
 * src/content when no database is configured (or it is unreachable).
 */
async function withFallback<T>(label: string, load: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured) return fallback;
  try {
    return await load();
  } catch (e) {
    console.error(`[content] failed to load ${label}, using static defaults`, e);
    return fallback;
  }
}

export const getCaseStudies = cache((): Promise<CaseStudy[]> =>
  withFallback(
    "portfolio",
    async () => {
      const rows = await db.portfolioItem.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        client: r.client,
        industry: r.industry,
        country: r.country,
        category: r.category as PortfolioCategory,
        services: r.services as ServiceSlug[],
        summary: r.summary,
        problem: r.problem,
        solution: r.solution,
        result: r.result,
        results: r.results,
        tech: r.tech,
        coverImage: r.coverImage ?? undefined,
        gallery: r.gallery,
        testimonial: r.testimonialQuote
          ? { quote: r.testimonialQuote, name: r.testimonialName ?? "", role: r.testimonialRole ?? "" }
          : undefined,
      }));
    },
    defaultCaseStudies,
  ),
);

export const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | undefined> =>
  (await getCaseStudies()).find((c) => c.slug === slug),
);

export const getTestimonials = cache((): Promise<TestimonialItem[]> =>
  withFallback(
    "testimonials",
    () =>
      db.testimonial.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: { name: true, role: true, company: true, country: true, quote: true },
      }),
    defaultTestimonials,
  ),
);

export const getFaqs = cache((): Promise<FaqItem[]> =>
  withFallback(
    "faqs",
    () =>
      db.faq.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { question: true, answer: true },
      }),
    defaultFaqs,
  ),
);

export const getPosts = cache((): Promise<BlogPostView[]> =>
  withFallback(
    "blog posts",
    async () => {
      const rows = await db.blogPost.findMany({
        where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
        orderBy: [{ publishedAt: "desc" }],
        include: { category: { select: { name: true, slug: true } } },
      });
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        coverImage: r.coverImage,
        authorName: r.authorName,
        category: r.category,
        publishedAt: (r.publishedAt ?? r.createdAt).toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        seoTitle: r.seoTitle,
        seoDescription: r.seoDescription,
      }));
    },
    [...defaultPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  ),
);

export const getPost = cache(async (slug: string): Promise<BlogPostView | undefined> =>
  (await getPosts()).find((p) => p.slug === slug),
);

export const getCategories = cache((): Promise<BlogCategory[]> =>
  withFallback(
    "categories",
    () =>
      db.category.findMany({
        where: { posts: { some: { status: "PUBLISHED" } } },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      }),
    defaultCategories,
  ),
);

/** Splits admin text into paragraphs on blank lines. */
function paragraphs(text: string | null): string[] | undefined {
  const parts = (text ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

export const getTeam = cache((): Promise<TeamMember[]> =>
  withFallback(
    "team",
    async () => {
      const rows = await db.teamMember.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((r) => ({
        name: r.name,
        role: r.role,
        photo: r.photo ?? undefined,
        email: r.email ?? undefined,
        phone: r.phone ?? undefined,
        bio: paragraphs(r.bio),
        featured: r.featured,
      }));
    },
    defaultTeam,
  ),
);
