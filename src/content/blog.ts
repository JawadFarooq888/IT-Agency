/**
 * Starter blog posts, used until the database is connected. After that,
 * posts are written and published from /admin/blog (these are seeded there).
 */
export type BlogCategory = { name: string; slug: string };

export type BlogPostView = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  coverImage?: string | null;
  authorName: string;
  category?: BlogCategory | null;
  publishedAt: string; // ISO date
  updatedAt?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export const defaultCategories: BlogCategory[] = [
  { name: "Web Development", slug: "web-development" },
  { name: "AI & Automation", slug: "ai-automation" },
  { name: "Growth", slug: "growth" },
];

export const defaultPosts: BlogPostView[] = [
  {
    slug: "how-much-does-a-business-website-cost",
    title: "How much does a business website cost?",
    excerpt:
      "A simple breakdown of what goes into the price of a small business website, and how to avoid paying for things you do not need.",
    authorName: "[Author name]",
    category: defaultCategories[0],
    publishedAt: "2026-09-01T09:00:00.000Z",
    content: `Most business owners ask the same first question: how much will my website cost? The honest answer is that it depends, but the parts that make up the price are always the same.

## What affects the price

### Number of pages

A five page website (home, about, services, contact and one landing page) takes much less time than a thirty page site with a blog and case studies.

### Custom design or template

A template is faster and cheaper. A custom design takes longer but fits your brand and usually converts better.

### Features

Online payments, booking systems, user accounts and integrations with other tools all add time.

## Typical price ranges

- **Simple business website:** [$X to $Y]
- **Website with blog and more pages:** [$X to $Y]
- **Online store or custom web app:** [$X and up]

## How to keep costs down

1. Start with the pages that bring in customers.
2. Write your own text if you can, or give us clear notes.
3. Add advanced features in a second phase once the site is live.

## Get a fixed price

Send us a short description of what you need and we will reply with a fixed price quote within 24 hours.`,
  },
  {
    slug: "ai-chatbot-for-small-business",
    title: "Does your small business need an AI chatbot?",
    excerpt: "Where AI chatbots save time, where they do not, and how to start small without a big budget.",
    authorName: "[Author name]",
    category: defaultCategories[1],
    publishedAt: "2026-09-10T09:00:00.000Z",
    content: `AI chatbots are everywhere, but not every business needs one. Here is a simple way to decide.

## Signs a chatbot will help

- You answer the same questions again and again.
- Leads message you outside working hours.
- Your team spends hours copying data from messages into other tools.

## Signs it will not help yet

- You get only a few messages a week.
- Every enquiry needs a detailed, custom answer.

## What a good chatbot does

### Answers from your own content

The best chatbots are trained on your website, price lists and FAQs, so answers stay accurate.

### Hands over to a person

When the bot is not sure, it should pass the chat to your team with the full history.

### Captures leads

Name, email, phone and what they need should go straight into your CRM or a Google Sheet.

## How to start

Pick one channel, usually your website or WhatsApp, and one goal, such as answering FAQs. Measure the results for a month, then expand.`,
  },
  {
    slug: "questions-to-ask-before-hiring-a-developer",
    title: "7 questions to ask before hiring a developer",
    excerpt: "Use these questions to compare agencies and freelancers and avoid the most common problems.",
    authorName: "[Author name]",
    category: defaultCategories[2],
    publishedAt: "2026-09-20T09:00:00.000Z",
    content: `Hiring the wrong developer is expensive. These questions help you find the right one.

## 1. Can I see similar work?

Ask for projects close to yours, and ask what result each one achieved.

## 2. Is the price fixed?

A fixed price protects you from surprise invoices. Make sure you know what is included.

## 3. How often will I get updates?

Weekly updates with a live demo are a good sign.

## 4. Who owns the code?

You should own the code, designs and accounts once the project is paid.

## 5. What happens after launch?

Ask how long free support lasts and what monthly support costs.

## 6. Will you sign an NDA?

A professional team will not hesitate.

## 7. How do payments work?

Milestone payments tied to clear deliverables are fair for both sides.`,
  },
];
