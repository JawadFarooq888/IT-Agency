/**
 * Seeds the database with the admin user and placeholder content.
 * Run with: npm run db:seed   (safe to run more than once)
 *
 * Services are not stored in the database: edit them in src/content/services.ts.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PostStatus } from "../src/generated/prisma/client";
import { defaultFaqs } from "../src/content/faqs";
import { defaultTestimonials } from "../src/content/testimonials";
import { defaultCaseStudies } from "../src/content/portfolio";
import { defaultCategories, defaultPosts } from "../src/content/blog";
import { defaultSettings } from "../src/content/site";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  // Admin user
  const email = process.env.ADMIN_SEED_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env before seeding.");
  }
  if (password.length < 10) throw new Error("ADMIN_SEED_PASSWORD must be at least 10 characters.");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists (password not changed).`);
  } else {
    await db.user.create({
      data: { email, name: process.env.ADMIN_SEED_NAME ?? "Admin", passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`Created admin user ${email}`);
  }

  // Site settings
  await db.siteSetting.upsert({
    where: { key: "site" },
    update: {},
    create: { key: "site", value: defaultSettings },
  });

  // Only seed content tables that are empty, so re-running never overwrites your edits
  if ((await db.faq.count()) === 0) {
    await db.faq.createMany({ data: defaultFaqs.map((f, i) => ({ ...f, sortOrder: i })) });
    console.log(`Seeded ${defaultFaqs.length} FAQs`);
  }

  if ((await db.testimonial.count()) === 0) {
    await db.testimonial.createMany({ data: defaultTestimonials.map((t, i) => ({ ...t, sortOrder: i })) });
    console.log(`Seeded ${defaultTestimonials.length} testimonials`);
  }

  if ((await db.portfolioItem.count()) === 0) {
    await db.portfolioItem.createMany({
      data: defaultCaseStudies.map((c, i) => ({
        slug: c.slug,
        title: c.title,
        client: c.client,
        industry: c.industry,
        country: c.country,
        category: c.category,
        services: c.services,
        summary: c.summary,
        problem: c.problem,
        solution: c.solution,
        result: c.result,
        results: c.results,
        tech: c.tech,
        coverImage: c.coverImage ?? null,
        gallery: c.gallery,
        testimonialQuote: c.testimonial?.quote ?? null,
        testimonialName: c.testimonial?.name ?? null,
        testimonialRole: c.testimonial?.role ?? null,
        sortOrder: i,
      })),
    });
    console.log(`Seeded ${defaultCaseStudies.length} portfolio items`);
  }

  for (const c of defaultCategories) {
    await db.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  if ((await db.blogPost.count()) === 0) {
    for (const p of defaultPosts) {
      const category = p.category ? await db.category.findUnique({ where: { slug: p.category.slug } }) : null;
      await db.blogPost.create({
        data: {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          authorName: p.authorName,
          categoryId: category?.id ?? null,
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(p.publishedAt),
        },
      });
    }
    console.log(`Seeded ${defaultPosts.length} blog posts`);
  }
}

main()
  .then(() => console.log("Seed complete."))
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
