import "server-only";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

export type FormState = {
  ok?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** "a\nb\n\nc" -> ["a","b","c"] */
export function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "a, b ,c" -> ["a","b","c"] */
export function commaList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

/** Refresh every public page after content changes. */
export function revalidateSite(): void {
  revalidatePath("/", "layout");
}
