# TechApp Solutions website

Company website for an IT services agency: web, mobile, desktop, UI/UX, AI and automation, database and cloud, and social media and SEO. The main goal is leads. Every page points visitors to the quote form, WhatsApp, email or a booked call.

**Stack:** Next.js 16 (App Router, TypeScript strict), Tailwind CSS 4, PostgreSQL (Neon) with Prisma 7, Auth.js v5 (credentials + bcrypt), Zod and React Hook Form, Resend with React Email, Vercel Blob, lucide-react. Hosted on Vercel.

---

## Contents

1. [What is included](#what-is-included)
2. [Local setup](#local-setup)
3. [Database setup on Neon](#database-setup-on-neon)
4. [Creating the admin user](#creating-the-admin-user)
5. [Editing content](#editing-content)
6. [Deploying to Vercel](#deploying-to-vercel)
7. [Connecting your custom domain](#connecting-your-custom-domain)
8. [Resend domain verification (emails)](#resend-domain-verification-emails)
9. [Other services: Turnstile, Blob, Analytics, Search Console](#other-services)
10. [Environment variables](#environment-variables)
11. [Scripts](#scripts)
12. [Project structure](#project-structure)
13. [Before you launch: placeholder checklist](#before-you-launch-placeholder-checklist)

---

## What is included

**Public site**

- Home: hero with stats, trust strip, services grid, process, portfolio preview with filters, testimonials, why us, FAQ, contact section with the full quote form.
- `/services` and 7 service pages (`/services/[slug]`), each with problems, deliverables, tech stack, process, related work, starting price, FAQs and a quote form with that service pre-selected.
- `/portfolio` (filterable) and case studies (`/portfolio/[slug]`).
- `/about`, `/pricing`, `/blog` (categories and search) with articles (`/blog/[slug]`: table of contents, reading time, related posts), `/contact` (quote form, call booking form, Google Map), `/privacy-policy`, `/terms`, custom 404.
- Floating WhatsApp button on every public page. On service pages its message names the service.

**Lead capture**

- One Zod schema validates the quote form in the browser and again in the server action.
- Spam protection: hidden honeypot field, Cloudflare Turnstile, and a per-IP rate limit (5 requests per hour, stored as a hashed IP).
- Attachments (PDF, DOC, DOCX, PNG, JPG, up to 4MB) are saved to Vercel Blob by the server.
- Each lead is saved with its source page, referrer and UTM tags.
- You get an email notification with a one-click WhatsApp reply link. The client gets a branded auto-reply.
- "Book a call" opens a short booking form (date, time window in the visitor's time zone, note). Requests are saved as leads with the service "Consultation call", and both sides get an email.
- GA4 events: `quote_form_submit`, `consultation_booked`, `book_call_open`, `whatsapp_click`, `email_click`.

**Admin panel (`/admin`)**

- Login (bcrypt passwords, rate-limited), protected by `src/proxy.ts` and checked again in every page and server action.
- Dashboard: total leads, new this week, won, conversion rate, leads by service and by budget.
- Leads: search, filters (status, service, budget, date), sorting, pagination, CSV export, detail view, status pipeline (New, Contacted, Proposal Sent, Won, Lost) and private notes.
- Content: portfolio (with image uploads), testimonials, blog posts (Markdown editor with preview, cover image, category, SEO fields, draft or published) and FAQs. Create, edit, delete, and reorder with up/down buttons.
- Settings: contact details, social links and hero stats, with no code changes.

**SEO and security**

- A title, description and canonical URL on every page; dynamic Open Graph images; `sitemap.xml` and `robots.txt`.
- JSON-LD structured data: Organization, LocalBusiness (ProfessionalService), Service, FAQPage, Article, BreadcrumbList.
- Security headers in `next.config.ts`: CSP, X-Frame-Options, HSTS, nosniff, Referrer-Policy and Permissions-Policy.

---

## Local setup

Requirements: **Node.js 20.9 or newer** (tested on Node 24) and npm.

```bash
git clone https://github.com/JawadFarooq888/IT-Agency.git
cd IT-Agency
npm install                # also generates the Prisma client
cp .env.example .env       # then fill in the values (see below)
```

At minimum, set these in `.env` for local development:

- `AUTH_SECRET`: run `npx auth secret`, or use any random string of 32+ characters.
- `DATABASE_URL`: your Neon URL (next section), or a local database (see below).
- `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`: your first admin login.

Then create the tables, seed them and start the site:

```bash
npm run db:migrate         # creates the tables
npm run db:seed            # admin user + placeholder content
npm run dev                # http://localhost:3000
```

**No database yet?** The public site still runs. It uses the static content in `src/content/`. The quote form shows the success screen but saves nothing, and the admin panel needs a database.

**Local database without Neon:** Prisma can run a small Postgres for you:

```bash
npx prisma dev --name itagency --detach    # prints a postgres://... TCP URL
```

Put the `postgres://...` URL in `DATABASE_URL`, then run `db:migrate` and `db:seed`. After a restart, start it again with `npx prisma dev start itagency`. It accepts only a few connections, so stop `npm run dev` before running `npm run build` against it.

---

## Database setup on Neon

1. Create a free account at [neon.tech](https://neon.tech) and create a project. Pick the region closest to your Vercel region, for example `us-east-1` (AWS) or `eu-central-1`.
2. On the project dashboard, open **Connect**:
   - Turn **Connection pooling ON** and copy the string. This is `DATABASE_URL` (the host contains `-pooler`).
   - Turn **Connection pooling OFF** and copy the string. This is `DIRECT_URL`. Prisma migrations use it.
3. Put both in `.env` (and later in Vercel). Keep `?sslmode=require` at the end.
4. Create the tables:
   ```bash
   npm run db:migrate          # local development: creates and applies migrations
   # or, for an existing production database:
   npm run db:deploy           # applies the migrations in prisma/migrations
   ```
5. Seed: `npm run db:seed`.

Supabase also works. Use the "Transaction pooler" URL as `DATABASE_URL` and the "Direct connection" URL as `DIRECT_URL`.

---

## Creating the admin user

The seed script creates one admin from your environment variables:

```bash
# in .env
ADMIN_SEED_EMAIL="you@techappsolutions.com"
ADMIN_SEED_PASSWORD="a-long-unique-password"     # at least 10 characters
ADMIN_SEED_NAME="Your Name"

npm run db:seed
```

Then log in at `/admin/login`.

- The seed is safe to run again. It never overwrites an existing user or content you have edited.
- **Change the password:** there is no password screen yet. Delete the user in `npm run db:studio` (table `User`), then run `npm run db:seed` again with the new password.
- **Add another admin:** run the seed again with a different `ADMIN_SEED_EMAIL`.
- Against production, run the seed from your computer with the production `DATABASE_URL` in `.env`.

---

## Editing content

**From the admin panel (no code):**

| What                                          | Where                 |
| --------------------------------------------- | --------------------- |
| Leads                                         | `/admin/leads`        |
| Case studies (portfolio)                      | `/admin/portfolio`    |
| Testimonials                                  | `/admin/testimonials` |
| Blog posts                                    | `/admin/blog`         |
| Home page FAQs                                | `/admin/faqs`         |
| WhatsApp, email, location, socials, hero stats | `/admin/settings` |

Changes appear on the website right away.

**In code (typed files in `src/content/`):**

| File                   | What it controls                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `site.ts`              | Company name, domain, tagline, description, default contact details                     |
| `services.ts`          | All 7 services: text, problems, deliverables, tech stack, process, starting price, FAQs |
| `pricing.ts`           | Pricing packages (Basic, Standard, Premium)                                             |
| `about.ts`             | Story, mission, values, team                                                            |
| `home.ts`              | Process steps, "why choose us" points, client logo placeholders                         |
| `portfolio.ts`, `testimonials.ts`, `faqs.ts`, `blog.ts` | Starter content (seed data, and the fallback when there is no database) |

**Design tokens** (colors, fonts, sizes, radii, shadows) live in `tailwind.config.ts`. Change a value there and the whole site follows. Fonts (Sora and DM Sans) are loaded in `src/app/layout.tsx`.

**Logo:** replace the placeholder mark in `src/components/ui/Logo.tsx` and the icon in `src/app/icon.svg`.

**Images:** upload them in the admin (needs Vercel Blob) or paste any `https://` image URL. Team members, photos, titles, emails and phone numbers are edited in **Admin → Team**. Large photos are resized in the browser before upload.

---

## Deploying to Vercel

1. Push the code to GitHub (already done: `JawadFarooq888/IT-Agency`).
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the repository. Vercel detects Next.js; keep the defaults.
   - The build command in `package.json` is `prisma generate && next build`.
3. **Storage → Create → Blob**, with access set to **Public**. Connect it to the project. This adds `BLOB_STORE_ID`, which is enough on Vercel (uploads use Vercel's built-in OIDC login). `BLOB_READ_WRITE_TOKEN` also works if you have one.
4. Under **Settings → Environment Variables**, add everything from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` = `https://techappsolutions.com` (your real domain, no trailing slash)
   - `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
   - `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CALENDLY_URL`
5. Apply the database migrations to production once, from your computer, with the production URLs in `.env`:
   ```bash
   npm run db:deploy
   npm run db:seed
   ```
6. Click **Deploy**. Later pushes to `main` deploy automatically. Pull requests get preview URLs, and those are hidden from search engines by `robots.txt`.

After changing an environment variable, redeploy it under **Deployments → ⋯ → Redeploy**. `NEXT_PUBLIC_*` values are built into the pages.

---

## Connecting your custom domain

1. In Vercel, open **Project → Settings → Domains**, add `techappsolutions.com`, then add `www.techappsolutions.com` and redirect it to `techappsolutions.com` (or the other way round).
2. Vercel shows the DNS records to create. At your domain registrar (Namecheap, GoDaddy, Cloudflare and so on):
   - Root domain `techappsolutions.com`: an **A** record to the IP Vercel shows (currently `76.76.21.21`).
   - `www`: a **CNAME** record to the value Vercel shows (for example `cname.vercel-dns.com`).
   - Or switch the domain's nameservers to Vercel's, if you prefer.
3. Wait until the domain shows **Valid Configuration** (usually minutes, sometimes a few hours). HTTPS is set up automatically.
4. Set `NEXT_PUBLIC_SITE_URL=https://techappsolutions.com` in Vercel and redeploy. Canonical URLs, the sitemap and email links use it.

---

## Resend domain verification (emails)

Until your domain is verified, Resend only lets you send test emails to your own address from `onboarding@resend.dev`.

1. Create an account at [resend.com](https://resend.com) and go to **Domains → Add Domain**. Enter `techappsolutions.com`, or a subdomain such as `mail.techappsolutions.com`.
2. Resend shows DNS records, usually:
   - an **MX** record and a **TXT (SPF)** record for a `send` subdomain
   - a **TXT (DKIM)** record `resend._domainkey`
   - optional: a **TXT (DMARC)** record `_dmarc` with `v=DMARC1; p=none;`
3. Add them at your DNS provider exactly as shown. If your DNS is on Vercel, add them under **Vercel → Domains → techappsolutions.com → DNS Records**.
4. Click **Verify** in Resend and wait until the status is **Verified**.
5. Create an API key (**API Keys → Create**, "Sending access") and set:
   ```
   RESEND_API_KEY="re_..."
   EMAIL_FROM="TechApp Solutions <hello@techappsolutions.com>"
   ADMIN_EMAIL="you@techappsolutions.com"
   ```
6. Test it: send the quote form. You get the lead notification, and the address in the form gets the auto-reply.

Email templates live in `src/emails/`. If emails fail, the lead is still saved and the error is logged in Vercel's function logs.

---

## Other services

**Cloudflare Turnstile (spam protection).** In the Cloudflare dashboard, go to **Turnstile → Add widget**. Add your domain (and `localhost` for testing) and choose the "Managed" mode. Copy the site key to `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the secret to `TURNSTILE_SECRET_KEY`. Leave both empty to switch Turnstile off. The honeypot and rate limit still apply.

**Vercel Blob (file uploads).** Create it under Vercel → Storage as above. For local testing, run `vercel env pull` or copy a `BLOB_READ_WRITE_TOKEN` into `.env`.

**Google Analytics 4.** Create a GA4 property and a Web data stream. Copy the Measurement ID (`G-XXXXXXXXXX`) to `NEXT_PUBLIC_GA_ID`. To count leads as conversions, go to **GA4 → Admin → Events** and mark `quote_form_submit` and `consultation_booked` as key events. Also consider `whatsapp_click`, `email_click` and `book_call_open`.

**Google Search Console.** Add the property `https://techappsolutions.com` and choose the **HTML tag** method. Copy only the `content="..."` value into `NEXT_PUBLIC_GSC_VERIFICATION`, redeploy, and click Verify. Then submit `https://techappsolutions.com/sitemap.xml` under **Sitemaps**.

**Call bookings.** "Book a call" buttons open a booking form. Requests appear in `/admin/leads` with the service "Consultation call" and the preferred date and time. Confirm the exact time with the client on WhatsApp or email.

---

## Environment variables

Every variable is listed and explained in [`.env.example`](.env.example). Summary:

| Variable                                                                    | Required               | Used for                                                  |
| --------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                      | yes (production)       | Canonical URLs, sitemap, emails                           |
| `DATABASE_URL` / `DIRECT_URL`                                               | yes                    | Database (pooled / direct for migrations)                 |
| `AUTH_SECRET`                                                               | yes                    | Signing admin sessions                                    |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` / `ADMIN_SEED_NAME`              | for seeding            | First admin user                                          |
| `RESEND_API_KEY` / `EMAIL_FROM` / `ADMIN_EMAIL`                             | for emails             | Lead notification and auto-reply                          |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`                   | recommended            | Spam protection                                           |
| `BLOB_STORE_ID` or `BLOB_READ_WRITE_TOKEN`                                  | for uploads            | Quote attachments and admin images                        |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GSC_VERIFICATION`                        | optional               | Analytics and Search Console                              |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CALENDLY_URL` | optional | Defaults until you save `/admin/settings`                 |
| `ADMIN_TIMEZONE`                                                            | optional               | Time zone for dates in the admin (default `Asia/Karachi`) |

Only `NEXT_PUBLIC_*` variables reach the browser. Never put secrets in them.

---

## Scripts

| Command                              | What it does                                  |
| ------------------------------------ | --------------------------------------------- |
| `npm run dev`                        | Development server on http://localhost:3000   |
| `npm run build` / `npm start`        | Production build / run it                     |
| `npm run lint`                       | ESLint                                        |
| `npm run typecheck`                  | TypeScript check                              |
| `npm run format` / `format:check`    | Prettier write / check                        |
| `npm run db:migrate`                 | Create and apply a migration (development)    |
| `npm run db:deploy`                  | Apply migrations (production)                 |
| `npm run db:seed`                    | Admin user and starter content                |
| `npm run db:studio`                  | Browse the database in the browser            |
| `npx tsx scripts/test-leads.ts add\|remove` | Add or remove two test leads (local only) |

After changing `prisma/schema.prisma`, run `npm run db:migrate -- --name what-changed` and commit the new folder in `prisma/migrations`.

---

## Project structure

```
prisma/
  schema.prisma          database models
  migrations/            SQL migrations (commit these)
  seed.ts                admin user + starter content
src/
  app/
    (site)/              public pages (share the navbar, footer, WhatsApp button)
    admin/               login, (panel)/ dashboard, leads, content, settings, actions/
    api/                 auth, upload tokens, CSV export
    actions/quote.ts     quote form server action
    sitemap.ts robots.ts opengraph-image.tsx icon.svg
  components/
    ui/                  buttons, container, logo, icons, links
    layout/              navbar, footer, floating WhatsApp, site frame
    sections/            page sections (hero, grids, FAQ, contact...)
    forms/               quote form, Turnstile
    admin/               admin shell, forms, tables, charts
    seo/                 JSON-LD, Google Analytics
  content/               typed static content (edit text here)
  emails/                React Email templates
  lib/                   db, auth helpers, email, security, validation, markdown, SEO
  auth.ts auth.config.ts proxy.ts   admin login and route protection
tailwind.config.ts       design tokens
next.config.ts           security headers, image settings
```

---

## Before you launch: placeholder checklist

Everything real is marked with `[square brackets]`. Search the project for `[` inside `src/content/` and the legal pages, and replace:

- [ ] Company name (`src/content/site.ts`: `name`, `domain`) and logo (`Logo.tsx`, `icon.svg`)
- [ ] WhatsApp number, email, location and social links (`/admin/settings`)
- [ ] Hero stats: projects delivered, Upwork rating (`/admin/settings`)
- [ ] Prices in `src/content/services.ts` and `src/content/pricing.ts`
- [ ] Real case studies with screenshots (`/admin/portfolio`), and delete the placeholder ones
- [ ] Real testimonials only (`/admin/testimonials`)
- [ ] Client logos in the trust strip (`src/components/sections/home/TrustStrip.tsx`, `src/content/home.ts`)
- [ ] About page story, team names, roles and photos (`src/content/about.ts`)
- [ ] Blog author names (`/admin/blog`)
- [ ] Privacy policy and terms: company name, dates, payment methods, governing law. Have them reviewed.
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
