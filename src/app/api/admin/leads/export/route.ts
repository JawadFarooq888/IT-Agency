import { auth } from "@/auth";
import { db } from "@/lib/db";
import { leadOrderBy, leadWhere, parseLeadFilters, statusLabels } from "@/lib/leads";

function csvCell(value: unknown): string {
  let s = value instanceof Date ? value.toISOString() : String(value ?? "");
  // Stop spreadsheet formula injection
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV export of leads, using the same filters as the leads table. */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const f = parseLeadFilters(sp);
  const leads = await db.lead.findMany({ where: leadWhere(f), orderBy: leadOrderBy(f), take: 10_000 });

  const header = [
    "Received",
    "Name",
    "Email",
    "Phone",
    "Company",
    "Service",
    "Budget",
    "Timeline",
    "Status",
    "Details",
    "Attachment",
    "Source page",
    "Referrer",
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "UTM term",
    "UTM content",
  ];
  const rows = leads.map((l) => [
    l.createdAt,
    l.fullName,
    l.email,
    l.phone,
    l.company,
    l.service,
    l.budget,
    l.timeline,
    statusLabels[l.status],
    l.details,
    l.attachmentUrl,
    l.sourcePage,
    l.referrer,
    l.utmSource,
    l.utmMedium,
    l.utmCampaign,
    l.utmTerm,
    l.utmContent,
  ]);
  const csv = "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
