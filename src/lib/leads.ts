import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { LeadStatus } from "@/generated/prisma/enums";

export const statusLabels: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
};

export const statusOrder = Object.keys(statusLabels) as LeadStatus[];

export const PAGE_SIZE = 20;

const sortable = ["createdAt", "fullName", "service", "budget", "status"] as const;
export type LeadSort = (typeof sortable)[number];

export type LeadFilters = {
  q: string;
  status: LeadStatus | "";
  service: string;
  budget: string;
  from: string;
  to: string;
  sort: LeadSort;
  dir: "asc" | "desc";
  page: number;
};

type SearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : "");

export function parseLeadFilters(sp: SearchParams): LeadFilters {
  const status = one(sp.status);
  const sort = one(sp.sort);
  const page = Number.parseInt(one(sp.page), 10);
  return {
    q: one(sp.q).slice(0, 100),
    status: (statusOrder as string[]).includes(status) ? (status as LeadStatus) : "",
    service: one(sp.service).slice(0, 100),
    budget: one(sp.budget).slice(0, 50),
    from: /^\d{4}-\d{2}-\d{2}$/.test(one(sp.from)) ? one(sp.from) : "",
    to: /^\d{4}-\d{2}-\d{2}$/.test(one(sp.to)) ? one(sp.to) : "",
    sort: (sortable as readonly string[]).includes(sort) ? (sort as LeadSort) : "createdAt",
    dir: one(sp.dir) === "asc" ? "asc" : "desc",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function leadWhere(f: LeadFilters): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  if (f.status) where.status = f.status;
  if (f.service) where.service = f.service;
  if (f.budget) where.budget = f.budget;
  if (f.from || f.to) {
    where.createdAt = {
      ...(f.from ? { gte: new Date(`${f.from}T00:00:00.000Z`) } : {}),
      ...(f.to ? { lte: new Date(`${f.to}T23:59:59.999Z`) } : {}),
    };
  }
  if (f.q) {
    where.OR = [
      { fullName: { contains: f.q, mode: "insensitive" } },
      { email: { contains: f.q, mode: "insensitive" } },
      { company: { contains: f.q, mode: "insensitive" } },
      { phone: { contains: f.q } },
      { details: { contains: f.q, mode: "insensitive" } },
    ];
  }
  return where;
}

export function leadOrderBy(f: LeadFilters): Prisma.LeadOrderByWithRelationInput[] {
  return f.sort === "createdAt" ? [{ createdAt: f.dir }] : [{ [f.sort]: f.dir }, { createdAt: "desc" }];
}

/** Builds a query string from filters, with overrides. Empty values are dropped. */
export function filtersToQuery(
  f: LeadFilters,
  overrides: Partial<Record<keyof LeadFilters, string | number>> = {},
) {
  const merged: Record<string, string | number> = { ...f, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v === "" || v === undefined) continue;
    if (k === "page" && Number(v) === 1) continue;
    if (k === "sort" && v === "createdAt") continue;
    if (k === "dir" && v === "desc") continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
