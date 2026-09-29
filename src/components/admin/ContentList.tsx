import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { deleteItem, moveItem } from "@/app/admin/actions/content";
import { ConfirmSubmit } from "./LeadControls";
import { EmptyState } from "./ui";
import { cn } from "@/lib/utils";

type Entity = Parameters<typeof moveItem>[0];

export type ContentRow = { id: string; title: string; subtitle?: string; badge?: { label: string; muted?: boolean } };

const iconBtn = "grid size-11 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";

/** List with move up / down, edit and delete. Order here is the order on the website. */
export function ContentList({
  entity,
  rows,
  editHref,
  empty,
  reorder = true,
}: {
  entity: Entity;
  rows: ContentRow[];
  editHref: (id: string) => string;
  empty: string;
  reorder?: boolean;
}) {
  if (rows.length === 0) return <EmptyState>{empty}</EmptyState>;
  return (
    <ul className="card divide-y divide-line">
      {rows.map((r, i) => (
        <li key={r.id} className="flex items-center gap-2 px-3 py-2 sm:px-4">
          {reorder && (
            <div className="flex shrink-0">
              <form action={moveItem.bind(null, entity, r.id, "up")}>
                <button type="submit" disabled={i === 0} aria-label={`Move "${r.title}" up`} className={iconBtn}>
                  <ArrowUp aria-hidden="true" className="size-4" />
                </button>
              </form>
              <form action={moveItem.bind(null, entity, r.id, "down")}>
                <button type="submit" disabled={i === rows.length - 1} aria-label={`Move "${r.title}" down`} className={iconBtn}>
                  <ArrowDown aria-hidden="true" className="size-4" />
                </button>
              </form>
            </div>
          )}
          <Link href={editHref(r.id)} className="min-w-0 flex-1 py-2 hover:text-accent">
            <span className="block truncate font-semibold text-ink">{r.title}</span>
            {r.subtitle && <span className="block truncate text-sm text-muted">{r.subtitle}</span>}
          </Link>
          {r.badge && (
            <span
              className={cn(
                "hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex",
                r.badge.muted ? "bg-[#EEEDEA] text-muted" : "bg-tint-green text-tint-green-ink",
              )}
            >
              {r.badge.label}
            </span>
          )}
          <Link href={editHref(r.id)} aria-label={`Edit "${r.title}"`} className={iconBtn}>
            <Pencil aria-hidden="true" className="size-4" />
          </Link>
          <form action={deleteItem.bind(null, entity, r.id)}>
            <ConfirmSubmit message={`Delete "${r.title}"? This cannot be undone.`} aria-label={`Delete "${r.title}"`} className={cn(iconBtn, "hover:text-red-700")}>
              <Trash2 aria-hidden="true" className="size-4" />
            </ConfirmSubmit>
          </form>
        </li>
      ))}
    </ul>
  );
}
