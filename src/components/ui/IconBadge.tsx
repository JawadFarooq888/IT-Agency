import type { LucideIcon } from "lucide-react";
import type { Tint } from "@/content/services";
import { cn } from "@/lib/utils";

export const tintClasses: Record<Tint, string> = {
  blue: "bg-tint-blue text-tint-blue-ink",
  orange: "bg-tint-orange text-tint-orange-ink",
  green: "bg-tint-green text-tint-green-ink",
};

export function IconBadge({
  icon: Icon,
  tint = "blue",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tint?: Tint;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "size-10 rounded-[10px]", md: "size-12 rounded-xl", lg: "size-14 rounded-2xl" }[size];
  const icon = { sm: "size-5", md: "size-6", lg: "size-7" }[size];
  return (
    <span className={cn("grid shrink-0 place-items-center", box, tintClasses[tint], className)}>
      <Icon aria-hidden="true" className={icon} />
    </span>
  );
}
