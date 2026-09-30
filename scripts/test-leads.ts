// Local testing helper: `npx tsx scripts/test-leads.ts add|remove`
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const TAG = "test-lead@example.com";

async function main() {
  if (process.argv[2] === "remove") {
    const { count } = await db.lead.deleteMany({ where: { email: TAG } });
    console.log(`Removed ${count} test leads`);
    return;
  }
  await db.lead.createMany({
    data: [
      {
        fullName: "Test Lead One",
        email: TAG,
        service: "Web Development",
        budget: "$2k to $10k",
        timeline: "1 month",
        details: "TEST: needs a new business website with booking.",
        phone: "+92 3001234567",
        sourcePage: "/",
        utmSource: "google",
      },
      {
        fullName: "Test Lead Two",
        email: TAG,
        service: "AI & Automation",
        budget: "$500 to $2k",
        details: "TEST: wants a WhatsApp AI chatbot for leads.",
        status: "WON",
        sourcePage: "/services/ai-automation",
      },
    ],
  });
  console.log("Added 2 test leads");
}

main().finally(() => db.$disconnect());
