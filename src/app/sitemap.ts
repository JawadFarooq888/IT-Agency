import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { getCaseStudies, getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

/** sitemap.xml: static pages, services, case studies and published posts. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, posts] = await Promise.all([getCaseStudies(), getPosts()]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/portfolio"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/privacy-policy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ].map((p) => ({ ...p, lastModified: now }) as MetadataRoute.Sitemap[number]);

  return [
    ...staticPages,
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...caseStudies.map((c) => ({
      url: absoluteUrl(`/portfolio/${c.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
