import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  id,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className={cn("eyebrow", dark && "text-[#9DB4FF]")}>{eyebrow}</p>}
      <h2 id={id} className={cn("heading-2 mt-3", dark && "text-white")}>
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-lg", dark ? "text-white/75" : "text-body")}>{description}</p>
      )}
      {children}
    </div>
  );
}
