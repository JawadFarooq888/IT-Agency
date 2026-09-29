import { cn } from "@/lib/utils";

/** Max 1248px content with 16px / 24px / 96px side padding. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-page px-4 md:px-6 xl:px-24", className)}>
      {children}
    </div>
  );
}
