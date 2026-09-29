"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { addLeadNote, updateLeadStatus } from "@/app/admin/actions/leads";
import { buttonClasses } from "@/components/ui/button-styles";
import { inputClass } from "@/components/ui/form-styles";
import { cn } from "@/lib/utils";

/** Pipeline buttons: New -> Contacted -> Proposal Sent -> Won / Lost */
export function LeadStatusPicker({
  leadId,
  status,
  options,
}: {
  leadId: string;
  status: string;
  options: { value: string; label: string }[];
}) {
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function choose(value: string) {
    if (value === current) return;
    const previous = current;
    setCurrent(value);
    setError(null);
    startTransition(async () => {
      const res = await updateLeadStatus(leadId, value);
      if (res.error) {
        setCurrent(previous);
        setError(res.error);
      }
    });
  }

  return (
    <div>
      <div role="radiogroup" aria-label="Lead status" className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={current === o.value}
            disabled={pending}
            onClick={() => choose(o.value)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-[15px] font-medium transition-colors",
              current === o.value ? "border-ink bg-ink text-white" : "border-line bg-card text-ink hover:border-ink/40",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-muted">
        {pending ? "Saving..." : error ? <span className="text-red-700">{error}</span> : null}
      </p>
    </div>
  );
}

export function NoteForm({ leadId }: { leadId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: Parameters<typeof addLeadNote>[1], fd: FormData) => {
    const res = await addLeadNote(leadId, prev, fd);
    if (res.ok) formRef.current?.reset();
    return res;
  }, {});

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <label htmlFor="note" className="sr-only">
        Add a private note
      </label>
      <textarea id="note" name="body" rows={3} placeholder="Add a private note (only admins see this)" className={cn(inputClass, "min-h-24")} />
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClasses("dark", "sm")}>
        {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />} Add note
      </button>
    </form>
  );
}

/** Submit button that asks for confirmation first. Use inside a <form action={...}>. */
export function ConfirmSubmit({
  message,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <button
      type="submit"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
