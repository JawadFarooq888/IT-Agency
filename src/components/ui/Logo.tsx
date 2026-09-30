import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** Placeholder logo mark + wordmark. Replace with your real logo SVG. */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-md", className)}
      aria-label={`${site.name} home`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 place-items-center rounded-[10px] font-display text-lg font-bold",
          light ? "bg-white text-ink" : "bg-ink text-white",
        )}
      >
        {site.name.charAt(0)}
      </span>
      <span
        className={cn("font-display text-xl font-bold tracking-tight", light ? "text-white" : "text-ink")}
      >
        {site.name}
        <span className="text-accent">.</span>
      </span>
    </Link>
  );
}
