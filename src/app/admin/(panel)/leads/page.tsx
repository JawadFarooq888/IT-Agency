import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Download, Search } from "lucide-react";
import { db } from "@/lib/db";
import {
  PAGE_SIZE,
  filtersToQuery,
  leadOrderBy,
  leadWhere,
  parseLeadFilters,
  statusLabels,
  statusOrder,
  type LeadFilters,
  type LeadSort,
} from "@/lib/leads";
import { serviceOptions } from "@/content/services";
import { CONSULTATION_SERVICE } from "@/lib/validations/booking";
import { budgetOptions } from "@/lib/validations/quote";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button-styles";
import { AdminHeader, EmptyState, StatusBadge } from "@/components/admin/ui";
import { formatDateTime } from "@/components/admin/format";

export const metadata: Metadata = { title: "Leads" };

const selectClass =
  "min-h-11 rounded-btn border border-line bg-card px-3 text-[15px] text-ink focus:border-accent";

function SortHeader({ f, col, children }: { f: LeadFilters; col: LeadSort; children: React.ReactNode }) {
  const active = f.sort === col;
  const nextDir = active && f.dir === "desc" ? "asc" : "desc";
  const Icon = f.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (f.dir === "asc" ? "ascending" : "descending") : "none"}
      className="px-4 py-3 text-left font-semibold"
    >
      <Link
        href={`/admin/leads${filtersToQuery(f, { sort: col, dir: nextDir, page: 1 })}`}
        className="inline-flex items-center gap-1 hover:text-accent"
      >
        {children}
        {active && <Icon aria-hidden="true" className="size-3.5" />}
      </Link>
    </th>
  );
}

export default async function LeadsPage(props: PageProps<"/admin/leads">) {
  const f = parseLeadFilters(await props.searchParams);
  const where = leadWhere(f);
  const [total, leads] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      orderBy: leadOrderBy(f),
      skip: (f.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { notes: true } } },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(f.q || f.status || f.service || f.budget || f.from || f.to);

  return (
    <>
      <AdminHeader
        title="Leads"
        description={`${total} ${total === 1 ? "lead" : "leads"}${filtered ? " match your filters" : ""}`}
        actions={
          <a
            href={`/api/admin/leads/export${filtersToQuery(f, { page: 1 })}`}
            className={buttonClasses("outline", "sm")}
          >
            <Download aria-hidden="true" className="size-4" /> Export CSV
          </a>
        }
      />

      <form
        action="/admin/leads"
        className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)_auto_auto_auto]"
      >
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="q" className="sr-only">
            Search
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
          />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={f.q}
            placeholder="Name, email, company, details"
            className={cn(selectClass, "w-full pl-9")}
          />
        </div>
        <label className="sr-only" htmlFor="status">
          Status
        </label>
        <select id="status" name="status" defaultValue={f.status} className={selectClass}>
          <option value="">All statuses</option>
          {statusOrder.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="service">
          Service
        </label>
        <select id="service" name="service" defaultValue={f.service} className={selectClass}>
          <option value="">All services</option>
          {[...serviceOptions, CONSULTATION_SERVICE].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="budget">
          Budget
        </label>
        <select id="budget" name="budget" defaultValue={f.budget} className={selectClass}>
          <option value="">All budgets</option>
          {budgetOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <label htmlFor="from" className="text-sm text-muted">
            From
          </label>
          <input id="from" name="from" type="date" defaultValue={f.from} className={selectClass} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="to" className="text-sm text-muted">
            To
          </label>
          <input id="to" name="to" type="date" defaultValue={f.to} className={selectClass} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className={buttonClasses("dark", "sm")}>
            Filter
          </button>
          {filtered && (
            <Link href="/admin/leads" className={buttonClasses("outline", "sm")}>
              Reset
            </Link>
          )}
        </div>
        {f.sort !== "createdAt" && <input type="hidden" name="sort" value={f.sort} />}
        {f.dir !== "desc" && <input type="hidden" name="dir" value={f.dir} />}
      </form>

      {leads.length === 0 ? (
        <EmptyState>
          {filtered
            ? "No leads match these filters."
            : "No leads yet. They will appear here when someone sends the quote form."}
        </EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-[15px]">
            <thead className="border-b border-line bg-canvas text-sm text-ink">
              <tr>
                <SortHeader f={f} col="fullName">
                  Name
                </SortHeader>
                <SortHeader f={f} col="service">
                  Service
                </SortHeader>
                <SortHeader f={f} col="budget">
                  Budget
                </SortHeader>
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  Source
                </th>
                <SortHeader f={f} col="status">
                  Status
                </SortHeader>
                <SortHeader f={f} col="createdAt">
                  Received
                </SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-canvas">
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink hover:text-accent">
                      {l.fullName}
                    </Link>
                    <span className="block text-sm text-muted">
                      {l.email}
                      {l.company ? ` · ${l.company}` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">{l.service}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {l.budget ?? <span className="text-muted">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{l.utmSource ?? l.sourcePage ?? "-"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} label={statusLabels[l.status]} />
                    {l._count.notes > 0 && (
                      <span className="ml-2 text-xs text-muted">{l._count.notes} notes</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-muted">
                    {formatDateTime(l.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-5 flex items-center justify-between gap-4 text-[15px]">
          <span className="text-muted">
            Page {f.page} of {pages}
          </span>
          <div className="flex gap-2">
            {f.page > 1 ? (
              <Link
                href={`/admin/leads${filtersToQuery(f, { page: f.page - 1 })}`}
                className={buttonClasses("outline", "sm")}
              >
                Previous
              </Link>
            ) : null}
            {f.page < pages ? (
              <Link
                href={`/admin/leads${filtersToQuery(f, { page: f.page + 1 })}`}
                className={buttonClasses("outline", "sm")}
              >
                Next
              </Link>
            ) : null}
          </div>
        </nav>
      )}
    </>
  );
}
