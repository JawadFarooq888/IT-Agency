import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { statusLabels, statusOrder } from "@/lib/leads";
import { serviceOptions } from "@/content/services";
import { CONSULTATION_SERVICE } from "@/lib/validations/booking";
import { budgetOptions } from "@/lib/validations/quote";
import { AdminHeader, EmptyState, StatusBadge } from "@/components/admin/ui";
import { BarList } from "@/components/admin/BarList";
import { formatDateTime } from "@/components/admin/format";

export const metadata: Metadata = { title: "Dashboard" };

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export default async function DashboardPage() {
  const weekAgo = daysAgo(7);
  const [total, newThisWeek, won, byService, byBudget, byStatus, recent] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    db.lead.count({ where: { status: "WON" } }),
    db.lead.groupBy({ by: ["service"], _count: { _all: true } }),
    db.lead.groupBy({ by: ["budget"], _count: { _all: true } }),
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const conversion = total ? ((won / total) * 100).toFixed(1) : "0.0";
  const count = <T,>(
    rows: (T & { _count: { _all: number } })[],
    pick: (r: T) => string | null,
    key: string,
  ) => rows.find((r) => (pick(r) ?? "Not set") === key)?._count._all ?? 0;

  const serviceRows = [...serviceOptions, CONSULTATION_SERVICE]
    .map((s) => ({ label: s, value: count(byService, (r) => r.service, s) }))
    .sort((a, b) => b.value - a.value);
  const budgetRows = [...budgetOptions, "Not set"].map((b) => ({
    label: b,
    value: count(byBudget, (r) => r.budget, b),
  }));

  const tiles = [
    { label: "Total leads", value: total.toLocaleString() },
    { label: "New this week", value: newThisWeek.toLocaleString() },
    { label: "Won", value: won.toLocaleString() },
    { label: "Conversion rate", value: `${conversion}%`, hint: "Won / total" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" description="Your lead pipeline at a glance." />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="card flex flex-col-reverse p-5">
            <dt className="mt-1 text-sm text-muted">
              {t.label}
              {t.hint && <span className="block text-xs">{t.hint}</span>}
            </dt>
            <dd className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums">
              {t.value}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Leads by status">
        {statusOrder.map((s) => (
          <li key={s}>
            <Link
              href={`/admin/leads?status=${s}`}
              className="card inline-flex min-h-11 items-center gap-2 px-3.5 text-sm hover:border-ink/25"
            >
              <StatusBadge status={s} label={statusLabels[s]} />
              <span className="font-semibold text-ink tabular-nums">
                {byStatus.find((r) => r.status === s)?._count._all ?? 0}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="card p-6" aria-labelledby="by-service">
          <h2 id="by-service" className="heading-3">
            Leads by service
          </h2>
          {total ? (
            <BarList caption="Leads by service" rows={serviceRows} total={total} />
          ) : (
            <p className="mt-4 text-muted">No leads yet.</p>
          )}
        </section>
        <section className="card p-6" aria-labelledby="by-budget">
          <h2 id="by-budget" className="heading-3">
            Leads by budget
          </h2>
          {total ? (
            <BarList caption="Leads by budget" rows={budgetRows} total={total} />
          ) : (
            <p className="mt-4 text-muted">No leads yet.</p>
          )}
        </section>
      </div>

      <section className="mt-8" aria-labelledby="recent">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent" className="heading-3">
            Latest leads
          </h2>
          <Link
            href="/admin/leads"
            className="inline-flex min-h-11 items-center gap-1 text-[15px] font-semibold text-accent"
          >
            All leads <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState>New quote requests from the website will appear here.</EmptyState>
        ) : (
          <ul className="card divide-y divide-line">
            {recent.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/admin/leads/${l.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-canvas"
                >
                  <span className="min-w-40 flex-1 font-semibold text-ink">{l.fullName}</span>
                  <span className="text-sm text-muted">{l.service}</span>
                  <span className="text-sm text-muted">{formatDateTime(l.createdAt)}</span>
                  <StatusBadge status={l.status} label={statusLabels[l.status]} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
