import {
  BrainCircuit,
  Code2,
  Database,
  Megaphone,
  Monitor,
  PenTool,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

/**
 * All service content lives here. Edit text, prices and FAQs in this file.
 * Values in [square brackets] are placeholders you must replace.
 */

export type ServiceSlug =
  | "web-development"
  | "mobile-apps"
  | "desktop-applications"
  | "ui-ux-design"
  | "ai-automation"
  | "database-cloud"
  | "social-media-seo";

export type PortfolioCategory = "web" | "mobile" | "ai" | "other";

export type Tint = "blue" | "orange" | "green";

export type Service = {
  slug: ServiceSlug;
  title: string;
  /** Short name used inside sentences, e.g. WhatsApp messages */
  name: string;
  icon: LucideIcon;
  tint: Tint;
  benefit: string;
  tags: string[];
  portfolioCategory: PortfolioCategory;
  hero: { headline: string; subtext: string };
  problems: { title: string; text: string }[];
  deliverables: string[];
  techStack: { group: string; items: string[] }[];
  process: { title: string; text: string }[];
  startingPrice: string;
  priceNote: string;
  faqs: { question: string; answer: string }[];
  seo: { title: string; description: string };
};

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    name: "a website or web app",
    icon: Code2,
    tint: "blue",
    benefit: "Fast, secure websites and web apps that turn visitors into customers.",
    tags: ["WordPress", "React", "Next.js", "Laravel"],
    portfolioCategory: "web",
    hero: {
      headline: "Websites and web apps that bring you customers",
      subtext:
        "From a clean business website to an online store or a custom web app. We build it fast, make it easy to manage, and set it up to rank on Google.",
    },
    problems: [
      {
        title: "Your website looks outdated",
        text: "Visitors leave in seconds when a site looks old or breaks on mobile. We design a modern site that builds trust.",
      },
      {
        title: "It does not bring in leads",
        text: "A site without clear calls to action is just a brochure. We add forms, WhatsApp and booking so visitors can reach you.",
      },
      {
        title: "It is slow and hard to update",
        text: "Slow pages lose sales and rankings. We build fast pages and give you a simple way to edit content yourself.",
      },
      {
        title: "Manual work eats your time",
        text: "Spreadsheets and email threads do not scale. A custom web app can handle bookings, orders or reports for you.",
      },
    ],
    deliverables: [
      "Custom design that matches your brand",
      "Mobile friendly and fast loading pages",
      "Contact forms, WhatsApp and booking integration",
      "Basic on-page SEO and Google Analytics setup",
      "Easy content editing for your team",
      "Secure hosting setup and SSL",
      "Training video and handover documents",
      "[30] days of free support after launch",
    ],
    techStack: [
      { group: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "TypeScript"] },
      { group: "CMS and backend", items: ["WordPress", "Laravel", "Node.js", "Headless CMS"] },
      { group: "E-commerce", items: ["WooCommerce", "Shopify", "Stripe", "PayPal"] },
    ],
    process: [
      { title: "Discuss", text: "We learn about your business, goals and customers." },
      { title: "Plan and quote", text: "You get a sitemap, timeline and fixed price." },
      { title: "Design", text: "You review page designs before we write any code." },
      { title: "Develop", text: "We build, test on all devices and share weekly progress." },
      { title: "Launch and support", text: "We go live, connect your domain and stay on for support." },
    ],
    startingPrice: "[$X]",
    priceNote: "for a business website of up to [5] pages",
    faqs: [
      {
        question: "How long does a website take?",
        answer:
          "A business website usually takes [2 to 4] weeks. Online stores and custom web apps take longer. You get an exact timeline with your quote.",
      },
      {
        question: "Can I update the website myself?",
        answer:
          "Yes. We set up an easy editor so you can change text, images and blog posts without any code, and we show you how.",
      },
      {
        question: "Do you provide hosting and a domain?",
        answer:
          "We can set up hosting and a domain in your name, or use the ones you already have. You always keep full ownership.",
      },
      {
        question: "Will my website work on mobile?",
        answer: "Yes. Every site we build is tested on phones, tablets and desktops before launch.",
      },
      {
        question: "Can you redesign my existing website?",
        answer:
          "Yes. We can keep your content and rankings while giving the site a modern design and better speed.",
      },
    ],
    seo: {
      title: "Web Development Services",
      description:
        "Custom business websites, online stores and web apps built with WordPress, React, Next.js and Laravel. Fast, mobile friendly and built to get leads.",
    },
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    name: "a mobile app",
    icon: Smartphone,
    tint: "orange",
    benefit: "Android and iOS apps your customers enjoy using every day.",
    tags: ["Flutter", "React Native", "Kotlin", "Swift"],
    portfolioCategory: "mobile",
    hero: {
      headline: "Mobile apps for Android and iOS, built to launch fast",
      subtext:
        "We turn your idea into a working app on both stores. One codebase where it makes sense, native code where it matters.",
    },
    problems: [
      {
        title: "You have an idea but no tech team",
        text: "We act as your product team, from the first sketch to the app store listing.",
      },
      {
        title: "Building two apps costs too much",
        text: "With Flutter or React Native, one codebase runs on Android and iOS, which saves time and money.",
      },
      {
        title: "Your current app is slow or buggy",
        text: "We fix crashes, improve speed and clean up the code so new features are easier to add.",
      },
      {
        title: "Customers expect an app",
        text: "An app keeps your brand on their phone with push notifications, bookings and loyalty features.",
      },
    ],
    deliverables: [
      "App design for Android and iOS",
      "Cross-platform or native development",
      "Admin panel to manage content and users",
      "Push notifications and analytics",
      "Payment and third-party integrations",
      "App Store and Google Play submission",
      "Source code and full ownership",
      "[30] days of free support after launch",
    ],
    techStack: [
      { group: "Cross-platform", items: ["Flutter", "React Native", "Expo"] },
      { group: "Native", items: ["Kotlin", "Swift", "Jetpack Compose", "SwiftUI"] },
      { group: "Backend", items: ["Firebase", "Node.js", "PostgreSQL", "REST and GraphQL APIs"] },
    ],
    process: [
      { title: "Discuss", text: "We map out your users, main features and goals." },
      { title: "Plan and quote", text: "You get a feature list, timeline and fixed price." },
      { title: "Design", text: "Clickable prototypes so you can try the app before we build it." },
      { title: "Develop", text: "Weekly test builds on your own phone." },
      { title: "Launch and support", text: "We publish to the stores and monitor the first weeks." },
    ],
    startingPrice: "[$X]",
    priceNote: "for a simple app on Android and iOS",
    faqs: [
      {
        question: "Should I build for Android, iOS or both?",
        answer:
          "Most businesses need both. We usually recommend Flutter or React Native so one codebase covers both platforms.",
      },
      {
        question: "How long does it take to build an app?",
        answer:
          "A first version usually takes [6 to 12] weeks depending on features. We can plan a smaller first release to launch sooner.",
      },
      {
        question: "Do you publish the app to the stores?",
        answer:
          "Yes. We prepare the listing, screenshots and handle the submission on your developer accounts.",
      },
      {
        question: "Will I own the source code?",
        answer: "Yes. You get full ownership of the code, designs and accounts when the project is paid.",
      },
    ],
    seo: {
      title: "Mobile App Development (Android and iOS)",
      description:
        "Android and iOS app development with Flutter, React Native, Kotlin and Swift. From idea to app store with a fixed price quote.",
    },
  },
  {
    slug: "desktop-applications",
    title: "Desktop Applications",
    name: "a desktop application",
    icon: Monitor,
    tint: "green",
    benefit: "Billing, inventory and POS software that fits the way you work.",
    tags: [".NET", "C#", "Electron"],
    portfolioCategory: "other",
    hero: {
      headline: "Desktop software for billing, inventory and daily operations",
      subtext:
        "Reliable Windows and cross-platform apps that work offline, print invoices and keep your data safe.",
    },
    problems: [
      {
        title: "Off-the-shelf software does not fit",
        text: "Generic tools force you to change how you work. We build around your exact process.",
      },
      {
        title: "Stock and billing errors",
        text: "Manual records lead to lost stock and wrong invoices. Software keeps every number in sync.",
      },
      {
        title: "Your internet is not always reliable",
        text: "Desktop apps keep working offline and sync when the connection is back.",
      },
      {
        title: "Old software nobody can maintain",
        text: "We can rebuild legacy tools with modern, supported technology and move your data safely.",
      },
    ],
    deliverables: [
      "Billing, invoicing and receipt printing",
      "Inventory and stock tracking",
      "Point of sale with barcode scanner support",
      "User roles and permissions",
      "Reports exported to Excel and PDF",
      "Automatic backups",
      "Installer and update system",
      "Training for your staff",
    ],
    techStack: [
      { group: "Desktop", items: [".NET", "C#", "WPF", "WinForms", "Electron"] },
      { group: "Database", items: ["SQL Server", "SQLite", "MySQL", "PostgreSQL"] },
      { group: "Reporting", items: ["Crystal Reports", "RDLC", "Excel export"] },
    ],
    process: [
      { title: "Discuss", text: "We visit or call to see how your team works today." },
      { title: "Plan and quote", text: "Screens, reports and a fixed price agreed up front." },
      { title: "Design", text: "Simple screens that staff can learn in minutes." },
      { title: "Develop", text: "Built in stages so you can test each part." },
      { title: "Launch and support", text: "Installation, data migration and staff training." },
    ],
    startingPrice: "[$X]",
    priceNote: "for a single-user billing or inventory app",
    faqs: [
      {
        question: "Does the software work without internet?",
        answer: "Yes. Desktop apps can run fully offline, with optional cloud sync and backups.",
      },
      {
        question: "Can multiple computers use the same data?",
        answer: "Yes. We can set up a shared database on your local network or in the cloud.",
      },
      {
        question: "Can you move data from my old system or Excel?",
        answer: "Yes. We import your existing products, customers and records during setup.",
      },
      {
        question: "Does it work with receipt printers and barcode scanners?",
        answer: "Yes. We support common thermal printers and USB barcode scanners.",
      },
    ],
    seo: {
      title: "Desktop Application Development (Billing, Inventory, POS)",
      description:
        "Custom desktop software for billing, inventory, POS and internal tools built with .NET, C# and Electron. Works offline with reports and backups.",
    },
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    name: "UI/UX design",
    icon: PenTool,
    tint: "orange",
    benefit: "Clear, simple designs that make your product easy to use.",
    tags: ["Figma", "Prototypes", "Design systems"],
    portfolioCategory: "web",
    hero: {
      headline: "Product design that users understand in seconds",
      subtext:
        "Wireframes, clickable prototypes and design systems in Figma, ready for your developers or ours.",
    },
    problems: [
      {
        title: "Users get lost in your product",
        text: "Confusing screens cause drop-offs. We simplify flows so users reach their goal faster.",
      },
      {
        title: "Every screen looks different",
        text: "A design system keeps colors, buttons and layouts consistent across your product.",
      },
      {
        title: "You need to pitch an idea",
        text: "A clickable prototype helps you test with users and show investors before you build.",
      },
      {
        title: "Developers keep guessing",
        text: "We hand over clean Figma files with specs, so what ships matches the design.",
      },
    ],
    deliverables: [
      "User flows and wireframes",
      "High fidelity designs for mobile and desktop",
      "Clickable Figma prototype",
      "Design system with reusable components",
      "Developer handover with specs and assets",
      "[2] rounds of revisions per screen",
    ],
    techStack: [
      { group: "Design", items: ["Figma", "FigJam", "Auto layout", "Variables"] },
      { group: "Testing", items: ["Prototypes", "Usability testing", "Heatmaps"] },
    ],
    process: [
      { title: "Discuss", text: "We learn about your users and what they need to do." },
      { title: "Plan and quote", text: "Screen list, timeline and fixed price." },
      { title: "Design", text: "Wireframes first, then polished screens." },
      { title: "Prototype", text: "Clickable prototype to test with real users." },
      { title: "Handover", text: "Organised Figma files and a walkthrough for developers." },
    ],
    startingPrice: "[$X]",
    priceNote: "for a landing page or [5] app screens",
    faqs: [
      {
        question: "Do I get the Figma source files?",
        answer: "Yes. You get full access to the Figma files and can edit them any time.",
      },
      {
        question: "Can you design for my existing developers?",
        answer: "Yes. We hand over specs and assets that any development team can work with.",
      },
      {
        question: "How many revisions are included?",
        answer: "Each package includes [2] rounds of revisions per screen. Extra rounds can be added.",
      },
      {
        question: "Can you improve my existing app design?",
        answer: "Yes. We start with a quick review, then redesign the screens that matter most.",
      },
    ],
    seo: {
      title: "UI/UX Design Services in Figma",
      description:
        "Wireframes, prototypes and design systems in Figma for websites and apps. Clear, simple designs your users and developers will love.",
    },
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    name: "AI and automation",
    icon: BrainCircuit,
    tint: "blue",
    benefit: "AI chatbots and automations that save hours every week.",
    tags: ["OpenAI", "Claude", "n8n", "Zapier", "Python"],
    portfolioCategory: "ai",
    hero: {
      headline: "AI chatbots and automations that work while you sleep",
      subtext:
        "Answer leads 24/7, remove repetitive tasks and connect your tools, with AI that is set up around your business.",
    },
    problems: [
      {
        title: "Leads wait hours for a reply",
        text: "An AI chatbot answers questions and books calls instantly on your website or WhatsApp.",
      },
      {
        title: "Your team copies data between tools",
        text: "We connect your forms, CRM, email and sheets so data moves by itself.",
      },
      {
        title: "Support questions repeat every day",
        text: "A chatbot trained on your own documents handles common questions and hands over the rest.",
      },
      {
        title: "You want AI but do not know where to start",
        text: "We find the tasks where AI saves the most time and build a small pilot first.",
      },
    ],
    deliverables: [
      "AI chatbot for your website or WhatsApp",
      "Chatbot trained on your own documents and FAQs",
      "Workflow automations between your apps",
      "AI features added to your existing software",
      "Lead capture into your CRM or Google Sheets",
      "Dashboard to review conversations",
      "Clear cost estimates for AI usage",
    ],
    techStack: [
      { group: "AI models", items: ["OpenAI", "Claude", "Open source models"] },
      { group: "Automation", items: ["n8n", "Zapier", "Make", "Python"] },
      { group: "Channels", items: ["Website chat", "WhatsApp Business API", "Email", "Slack"] },
    ],
    process: [
      { title: "Discuss", text: "We list the tasks that take your team the most time." },
      { title: "Plan and quote", text: "You get a plan, expected savings and a fixed price." },
      { title: "Pilot", text: "A small working version to test with real data." },
      { title: "Build", text: "We add integrations, guardrails and a review dashboard." },
      { title: "Launch and support", text: "We monitor answers and improve them over time." },
    ],
    startingPrice: "[$X]",
    priceNote: "for a website AI chatbot or one workflow automation",
    faqs: [
      {
        question: "Will the chatbot give wrong answers?",
        answer:
          "We train it on your own content, limit it to your topics and add a handover to a human when it is unsure.",
      },
      {
        question: "What does AI usage cost each month?",
        answer:
          "It depends on volume. Most small business chatbots cost [$X to $Y] per month in AI fees. We estimate this before you start.",
      },
      {
        question: "Can the chatbot work on WhatsApp?",
        answer: "Yes. We can connect it to the WhatsApp Business API as well as your website.",
      },
      {
        question: "Is my data safe?",
        answer:
          "We use business APIs that do not train on your data, and we can sign an NDA before you share anything.",
      },
      {
        question: "Which tools can you automate?",
        answer:
          "Most tools with an API, including Google Workspace, HubSpot, Shopify, Slack, Airtable and many more.",
      },
    ],
    seo: {
      title: "AI Chatbots and Workflow Automation",
      description:
        "AI chatbots for your website and WhatsApp, AI integrations and workflow automation with OpenAI, Claude, n8n, Zapier and Python.",
    },
  },
  {
    slug: "database-cloud",
    title: "Database & Cloud",
    name: "database and cloud work",
    icon: Database,
    tint: "green",
    benefit: "Clean data, fast APIs and reliable cloud hosting.",
    tags: ["SQL Server", "PostgreSQL", "MySQL", "Azure", "AWS"],
    portfolioCategory: "other",
    hero: {
      headline: "Databases, APIs and cloud hosting you can rely on",
      subtext:
        "We design databases, build APIs and reports, and move your systems to the cloud with less downtime and lower costs.",
    },
    problems: [
      {
        title: "Reports take hours to prepare",
        text: "We build dashboards and scheduled reports that pull numbers for you automatically.",
      },
      {
        title: "Your app slows down as data grows",
        text: "We tune queries, add indexes and redesign tables so pages load fast again.",
      },
      {
        title: "Systems do not talk to each other",
        text: "Secure APIs connect your website, apps and internal tools to the same data.",
      },
      {
        title: "Servers are costly or unreliable",
        text: "We move you to managed cloud hosting with backups, monitoring and clear monthly costs.",
      },
    ],
    deliverables: [
      "Database design and optimisation",
      "Data migration between systems",
      "REST APIs with documentation",
      "Reports and dashboards",
      "Cloud setup on Azure or AWS",
      "Automatic backups and monitoring",
      "Security review and access control",
    ],
    techStack: [
      { group: "Databases", items: ["SQL Server", "PostgreSQL", "MySQL", "MongoDB"] },
      { group: "APIs", items: [".NET Web API", "Node.js", "Laravel", "Python"] },
      { group: "Cloud", items: ["Azure", "AWS", "Vercel", "Docker"] },
      { group: "Reporting", items: ["Power BI", "SSRS", "Custom dashboards"] },
    ],
    process: [
      { title: "Discuss", text: "We review your current systems and pain points." },
      { title: "Plan and quote", text: "A clear plan with risks, timeline and fixed price." },
      { title: "Design", text: "Data model and architecture agreed before we build." },
      { title: "Build and migrate", text: "Tested in staging first, then moved with minimal downtime." },
      { title: "Launch and support", text: "Monitoring and backups from day one." },
    ],
    startingPrice: "[$X]",
    priceNote: "for a database review or a small API",
    faqs: [
      {
        question: "Can you work with my existing database?",
        answer: "Yes. We regularly improve and extend existing SQL Server, MySQL and PostgreSQL databases.",
      },
      {
        question: "Will moving to the cloud cause downtime?",
        answer:
          "We plan migrations to keep downtime to a minimum, usually outside your business hours.",
      },
      {
        question: "Azure or AWS, which is better for me?",
        answer:
          "Both are good. We recommend one based on your current tools, budget and where your customers are.",
      },
      {
        question: "Do you offer ongoing maintenance?",
        answer: "Yes. We offer monthly plans for monitoring, backups, updates and small changes.",
      },
    ],
    seo: {
      title: "Database Design, APIs and Cloud Hosting",
      description:
        "Database design, SQL Server, MySQL and PostgreSQL, APIs, reporting and cloud hosting on Azure and AWS for growing businesses.",
    },
  },
  {
    slug: "social-media-seo",
    title: "Social Media & SEO",
    name: "social media and SEO",
    icon: Megaphone,
    tint: "orange",
    benefit: "More people find you on Google and social media.",
    tags: ["SEO", "Meta Ads", "Google Ads", "Content"],
    portfolioCategory: "other",
    hero: {
      headline: "Get found on Google and grow on social media",
      subtext:
        "SEO, social media management, content and paid ads, planned around the customers you actually want.",
    },
    problems: [
      {
        title: "Customers cannot find you on Google",
        text: "We fix technical issues, improve your pages and target the searches your customers use.",
      },
      {
        title: "Social media takes too much time",
        text: "We plan, design and publish your posts so your pages stay active every week.",
      },
      {
        title: "Ads spend money without results",
        text: "We set up tracking and targeting so every ad dollar can be measured.",
      },
      {
        title: "You do not know what is working",
        text: "Monthly reports show traffic, leads and what we will improve next.",
      },
    ],
    deliverables: [
      "SEO audit and keyword research",
      "On-page and technical SEO fixes",
      "Google Business Profile setup",
      "Monthly content calendar and post designs",
      "Meta and Google Ads setup and management",
      "Conversion tracking",
      "Monthly performance report",
    ],
    techStack: [
      { group: "SEO", items: ["Google Search Console", "Google Analytics 4", "Ahrefs", "Semrush"] },
      { group: "Social", items: ["Facebook", "Instagram", "LinkedIn", "TikTok"] },
      { group: "Ads", items: ["Meta Ads", "Google Ads", "LinkedIn Ads"] },
    ],
    process: [
      { title: "Discuss", text: "We learn about your audience, competitors and goals." },
      { title: "Audit and plan", text: "A clear audit and a monthly plan with a fixed fee." },
      { title: "Create", text: "Content, designs and page improvements." },
      { title: "Publish and promote", text: "Posts, ads and SEO work every week." },
      { title: "Report and improve", text: "Monthly results and next steps." },
    ],
    startingPrice: "[$X]/month",
    priceNote: "for social media management or monthly SEO",
    faqs: [
      {
        question: "How long does SEO take to show results?",
        answer:
          "Most sites see clear progress in [3 to 6] months. Technical fixes and Google Business Profile can help sooner.",
      },
      {
        question: "Is ad spend included in your fee?",
        answer: "No. Ad spend is paid directly to Meta or Google. Our fee covers setup and management.",
      },
      {
        question: "Which social platforms do you manage?",
        answer: "Facebook, Instagram, LinkedIn and TikTok. We recommend the ones your customers use most.",
      },
      {
        question: "Is there a long contract?",
        answer: "No. Monthly plans can be cancelled with [30] days notice.",
      },
    ],
    seo: {
      title: "Social Media Management and SEO Services",
      description:
        "SEO, social media management, content creation and paid ads on Meta and Google for small and medium businesses.",
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Options for the quote form "Service needed" dropdown */
export const serviceOptions = [...services.map((s) => s.title), "Other"] as unknown as [string, ...string[]];
