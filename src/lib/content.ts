import "server-only";
import { cache } from "react";
import { defaultCaseStudies, type CaseStudy } from "@/content/portfolio";
import { defaultTestimonials, type TestimonialItem } from "@/content/testimonials";
import { defaultFaqs, type FaqItem } from "@/content/faqs";

/**
 * Content loaders for data that is editable in the admin panel.
 * Static defaults for now; switched to the database in Phase 5.
 */
export const getCaseStudies = cache(async (): Promise<CaseStudy[]> => defaultCaseStudies);

export const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | undefined> =>
  (await getCaseStudies()).find((c) => c.slug === slug),
);

export const getTestimonials = cache(async (): Promise<TestimonialItem[]> => defaultTestimonials);

export const getFaqs = cache(async (): Promise<FaqItem[]> => defaultFaqs);
