"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/auth";
import { db } from "@/lib/db";
import { commaList, lines, revalidateSite, str, zodFieldErrors, type FormState } from "@/lib/admin";
import { slugify } from "@/lib/markdown";
import { siteSettingsSchema } from "@/lib/settings";
import { services } from "@/content/services";

const slugSchema = z
  .string()
  .min(2, "Slug is required.")
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes only.");
const optionalUrl = z.union([z.url("Enter a full URL starting with https://"), z.literal("")]);
const required = (label: string, max = 5000) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

type Entity = "portfolio" | "testimonial" | "faq" | "blog";

// ---------- Reordering and deleting ----------

async function listOrder(entity: Entity): Promise<{ id: string }[]> {
  const orderBy = [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }];
  switch (entity) {
    case "portfolio":
      return db.portfolioItem.findMany({ orderBy, select: { id: true } });
    case "testimonial":
      return db.testimonial.findMany({ orderBy, select: { id: true } });
    case "faq":
      return db.faq.findMany({ orderBy, select: { id: true } });
    case "blog":
      return db.blogPost.findMany({ orderBy, select: { id: true } });
  }
}

function setOrder(entity: Entity, id: string, sortOrder: number) {
  const args = { where: { id }, data: { sortOrder } };
  switch (entity) {
    case "portfolio":
      return db.portfolioItem.update(args);
    case "testimonial":
      return db.testimonial.update(args);
    case "faq":
      return db.faq.update(args);
    case "blog":
      return db.blogPost.update(args);
  }
}

const adminPath: Record<Entity, string> = {
  portfolio: "/admin/portfolio",
  testimonial: "/admin/testimonials",
  faq: "/admin/faqs",
  blog: "/admin/blog",
};

/** Moves an item one place up or down and renumbers the list. */
export async function moveItem(entity: Entity, id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const ids = (await listOrder(entity)).map((r) => r.id);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  await db.$transaction(ids.map((itemId, index) => setOrder(entity, itemId, index)));
  revalidatePath(adminPath[entity]);
  revalidateSite();
}

export async function deleteItem(entity: Entity, id: string): Promise<void> {
  await requireAdmin();
  const where = { where: { id } };
  switch (entity) {
    case "portfolio":
      await db.portfolioItem.delete(where);
      break;
    case "testimonial":
      await db.testimonial.delete(where);
      break;
    case "faq":
      await db.faq.delete(where);
      break;
    case "blog":
      await db.blogPost.delete(where);
      break;
  }
  revalidateSite();
  redirect(adminPath[entity]);
}

async function nextSortOrder(entity: Entity): Promise<number> {
  return (await listOrder(entity)).length;
}

function isUniqueError(e: unknown): boolean {
  return typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "P2002";
}

// ---------- Portfolio ----------

const portfolioSchema = z.object({
  title: required("Title", 200),
  slug: slugSchema,
  client: required("Client", 120),
  industry: required("Industry", 120),
  country: required("Country", 80),
  category: z.enum(["web", "mobile", "ai", "other"]),
  services: z.array(z.enum(services.map((s) => s.slug) as [string, ...string[]])),
  summary: required("Summary", 400),
  problem: required("Problem"),
  solution: required("Solution"),
  result: required("Card result", 300),
  results: z.array(z.string().max(300)).max(10),
  tech: z.array(z.string().max(60)).max(20),
  coverImage: optionalUrl,
  gallery: z.array(z.url()).max(12),
  testimonialQuote: z.string().max(1000),
  testimonialName: z.string().max(120),
  testimonialRole: z.string().max(120),
  published: z.boolean(),
});

export async function savePortfolioItem(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = portfolioSchema.safeParse({
    title: str(formData.get("title")),
    slug: str(formData.get("slug")) || slugify(str(formData.get("title"))),
    client: str(formData.get("client")),
    industry: str(formData.get("industry")),
    country: str(formData.get("country")),
    category: str(formData.get("category")),
    services: formData.getAll("services").map(String),
    summary: str(formData.get("summary")),
    problem: str(formData.get("problem")),
    solution: str(formData.get("solution")),
    result: str(formData.get("result")),
    results: lines(formData.get("results")),
    tech: commaList(formData.get("tech")),
    coverImage: str(formData.get("coverImage")),
    gallery: lines(formData.get("gallery")),
    testimonialQuote: str(formData.get("testimonialQuote")),
    testimonialName: str(formData.get("testimonialName")),
    testimonialRole: str(formData.get("testimonialRole")),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: zodFieldErrors(parsed.error) };

  const d = parsed.data;
  const data = {
    ...d,
    coverImage: d.coverImage || null,
    testimonialQuote: d.testimonialQuote || null,
    testimonialName: d.testimonialName || null,
    testimonialRole: d.testimonialRole || null,
  };
  try {
    if (id) await db.portfolioItem.update({ where: { id }, data });
    else await db.portfolioItem.create({ data: { ...data, sortOrder: await nextSortOrder("portfolio") } });
  } catch (e) {
    if (isUniqueError(e)) return { error: "That slug is already used.", fieldErrors: { slug: "Already used." } };
    throw e;
  }
  revalidateSite();
  redirect("/admin/portfolio");
}

// ---------- Testimonials ----------

const testimonialSchema = z.object({
  name: required("Name", 120),
  role: required("Role", 120),
  company: required("Company", 120),
  country: required("Country", 80),
  quote: required("Quote", 1200),
  published: z.boolean(),
});

export async function saveTestimonial(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse({
    name: str(formData.get("name")),
    role: str(formData.get("role")),
    company: str(formData.get("company")),
    country: str(formData.get("country")),
    quote: str(formData.get("quote")),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: zodFieldErrors(parsed.error) };
  if (id) await db.testimonial.update({ where: { id }, data: parsed.data });
  else await db.testimonial.create({ data: { ...parsed.data, sortOrder: await nextSortOrder("testimonial") } });
  revalidateSite();
  redirect("/admin/testimonials");
}

// ---------- FAQs ----------

const faqSchema = z.object({
  question: required("Question", 300),
  answer: required("Answer", 2000),
  published: z.boolean(),
});

export async function saveFaq(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = faqSchema.safeParse({
    question: str(formData.get("question")),
    answer: str(formData.get("answer")),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: zodFieldErrors(parsed.error) };
  if (id) await db.faq.update({ where: { id }, data: parsed.data });
  else await db.faq.create({ data: { ...parsed.data, sortOrder: await nextSortOrder("faq") } });
  revalidateSite();
  redirect("/admin/faqs");
}

// ---------- Blog ----------

const blogSchema = z.object({
  title: required("Title", 200),
  slug: slugSchema,
  excerpt: required("Excerpt", 400),
  content: required("Content", 100_000),
  coverImage: optionalUrl,
  authorName: required("Author", 120),
  category: z.string().max(80),
  seoTitle: z.string().max(70, "Keep SEO titles under 70 characters."),
  seoDescription: z.string().max(170, "Keep SEO descriptions under 170 characters."),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  publishedAt: z.string().max(40),
});

export async function saveBlogPost(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = blogSchema.safeParse({
    title: str(formData.get("title")),
    slug: str(formData.get("slug")) || slugify(str(formData.get("title"))),
    excerpt: str(formData.get("excerpt")),
    content: String(formData.get("content") ?? ""),
    coverImage: str(formData.get("coverImage")),
    authorName: str(formData.get("authorName")),
    category: str(formData.get("category")),
    seoTitle: str(formData.get("seoTitle")),
    seoDescription: str(formData.get("seoDescription")),
    status: str(formData.get("status")),
    publishedAt: str(formData.get("publishedAt")),
  });
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: zodFieldErrors(parsed.error) };
  const d = parsed.data;

  // Find or create the category by name
  let categoryId: string | null = null;
  if (d.category) {
    const slug = slugify(d.category);
    const cat = await db.category.upsert({ where: { slug }, update: {}, create: { name: d.category, slug } });
    categoryId = cat.id;
  }

  let publishedAt: Date | null = d.publishedAt ? new Date(d.publishedAt) : null;
  if (publishedAt && Number.isNaN(publishedAt.getTime())) publishedAt = null;
  if (d.status === "PUBLISHED" && !publishedAt) publishedAt = new Date();

  const data = {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    content: d.content,
    coverImage: d.coverImage || null,
    authorName: d.authorName,
    categoryId,
    seoTitle: d.seoTitle || null,
    seoDescription: d.seoDescription || null,
    status: d.status,
    publishedAt,
  };
  try {
    if (id) await db.blogPost.update({ where: { id }, data });
    else await db.blogPost.create({ data: { ...data, sortOrder: await nextSortOrder("blog") } });
  } catch (e) {
    if (isUniqueError(e)) return { error: "That slug is already used.", fieldErrors: { slug: "Already used." } };
    throw e;
  }
  revalidateSite();
  redirect("/admin/blog");
}

// ---------- Settings ----------

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse({
    whatsappNumber: str(formData.get("whatsappNumber")).replace(/\D/g, ""),
    whatsappDisplay: str(formData.get("whatsappDisplay")),
    email: str(formData.get("email")),
    calendlyUrl: str(formData.get("calendlyUrl")),
    location: str(formData.get("location")),
    mapQuery: str(formData.get("mapQuery")),
    social: {
      linkedin: str(formData.get("social.linkedin")),
      facebook: str(formData.get("social.facebook")),
      instagram: str(formData.get("social.instagram")),
      upwork: str(formData.get("social.upwork")),
    },
    stats: {
      projects: str(formData.get("stats.projects")),
      rating: str(formData.get("stats.rating")),
      replyTime: str(formData.get("stats.replyTime")),
    },
    countriesLabel: str(formData.get("countriesLabel")),
  });
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: zodFieldErrors(parsed.error) };
  await db.siteSetting.upsert({
    where: { key: "site" },
    update: { value: parsed.data },
    create: { key: "site", value: parsed.data },
  });
  revalidateSite();
  return { ok: true, message: "Settings saved. The website is updated." };
}
