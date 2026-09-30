import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-[15px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  NEW: "bg-tint-blue text-tint-blue-ink",
  CONTACTED: "bg-tint-orange text-tint-orange-ink",
  PROPOSAL_SENT: "bg-[#EEE9FB] text-[#5B3FC4]",
  WON: "bg-tint-green text-tint-green-ink",
  LOST: "bg-[#EEEDEA] text-muted",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        statusStyles[status],
      )}
    >
      {label}
    </span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="card p-10 text-center text-[15px] text-muted">{children}</div>;
}
