"use client";

import { createContext, useActionState, useContext, useId, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import { upload } from "@vercel/blob/client";
import type { FormState } from "@/lib/admin";
import { renderMarkdown } from "@/lib/markdown";
import { buttonClasses } from "@/components/ui/button-styles";
import { inputClass, labelClass } from "@/components/ui/form-styles";
import { cn } from "@/lib/utils";

const FormStateContext = createContext<FormState>({});

/** Form bound to a server action; shows errors and a save button. */
export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  cancelHref,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
  cancelHref?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <FormStateContext.Provider value={state}>
      <form action={formAction} className="space-y-6">
        {state.error && (
          <p role="alert" className="flex gap-2 rounded-btn border border-red-200 bg-red-50 p-4 text-[15px] text-red-800">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" /> {state.error}
          </p>
        )}
        {state.ok && state.message && (
          <p role="status" className="flex gap-2 rounded-btn border border-[#BFE3CC] bg-tint-green p-4 text-[15px] text-tint-green-ink">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" /> {state.message}
          </p>
        )}
        {children}
        <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-canvas/95 px-4 py-4 backdrop-blur md:mx-0 md:rounded-btn md:border md:px-5">
          <button type="submit" disabled={pending} className={buttonClasses("primary", "md")}>
            {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            {pending ? "Saving..." : submitLabel}
          </button>
          {cancelHref && (
            <Link href={cancelHref} className={buttonClasses("outline", "md")}>
              Cancel
            </Link>
          )}
        </div>
      </form>
    </FormStateContext.Provider>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card grid gap-5 p-5 md:grid-cols-2 md:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="heading-3 md:col-span-2">{title}</h2>
      {children}
    </fieldset>
  );
}

type FieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
  placeholder?: string;
};

function useFieldError(name: string) {
  return useContext(FormStateContext).fieldErrors?.[name];
}

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  wide,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(wide && "md:col-span-2")}>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ name, label, defaultValue, hint, required, wide, placeholder, type = "text", list }: FieldProps & { type?: string; list?: string }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} wide={wide}>
      <input
        id={id}
        name={name}
        type={type}
        list={list}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextAreaField({ name, label, defaultValue, hint, required, wide = true, placeholder, rows = 4 }: FieldProps & { rows?: number }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} wide={wide}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(inputClass, "resize-y")}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  defaultValue,
  options,
  hint,
  wide,
}: FieldProps & { options: { value: string; label: string }[] }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} wide={wide}>
      <select id={id} name={name} defaultValue={defaultValue} className={inputClass} aria-invalid={Boolean(error)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3 md:col-span-2">
      <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} className="mt-0.5 size-5 accent-accent" />
      <label htmlFor={id} className="text-[15px] text-ink">
        {label}
        {hint && <span className="block text-sm text-muted">{hint}</span>}
      </label>
    </div>
  );
}

export function CheckboxGroup({
  name,
  legend,
  options,
  defaultValues,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  defaultValues: string[];
}) {
  return (
    <fieldset className="md:col-span-2">
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-4 text-[15px] has-[:checked]:border-accent has-[:checked]:bg-tint-blue">
            <input type="checkbox" name={name} value={o.value} defaultChecked={defaultValues.includes(o.value)} className="accent-accent" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be 8MB or smaller.");
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  const blob = await upload(`content/${safe}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
  return blob.url;
}

/** Single image: upload to Vercel Blob or paste a URL. */
export function ImageField({ name, label, defaultValue, hint }: { name: string; label: string; defaultValue?: string | null; hint?: string }) {
  const id = useId();
  const error = useFieldError(name);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    try {
      setUrl(await uploadImage(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FieldShell id={id} label={label} hint={hint} error={error ?? uploadError ?? undefined} wide>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="grid aspect-[16/10] w-full shrink-0 place-items-center overflow-hidden rounded-btn border border-line bg-canvas sm:w-48">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary URL
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus aria-hidden="true" className="size-6 text-muted" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input id={id} name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
          <div className="flex gap-2">
            <label className={cn(buttonClasses("outline", "sm"), "cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent")}>
              {busy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-4" />}
              {busy ? "Uploading..." : "Upload image"}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={onFile} className="sr-only" disabled={busy} />
            </label>
            {url && (
              <button type="button" onClick={() => setUrl("")} className={buttonClasses("outline", "sm")}>
                <X aria-hidden="true" className="size-4" /> Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </FieldShell>
  );
}

/** Several images, stored one URL per line. */
export function GalleryField({ name, label, defaultValue }: { name: string; label: string; defaultValue: string[] }) {
  const id = useId();
  const error = useFieldError(name);
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setUploadError(null);
    try {
      for (const f of files) {
        const u = await uploadImage(f);
        setUrls((prev) => [...prev, u]);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FieldShell id={id} label={label} error={error ?? uploadError ?? undefined} hint="One image URL per line. Upload or paste links." wide>
      {urls.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {urls.map((u, i) => (
            <li key={`${u}-${i}`} className="relative aspect-square overflow-hidden rounded-lg border border-line bg-canvas">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
              <img src={u} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setUrls((prev) => prev.filter((_, j) => j !== i))}
                aria-label={`Remove image ${i + 1}`}
                className="absolute top-1 right-1 grid size-8 place-items-center rounded-full bg-card/90 text-ink"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <textarea id={id} name={name} rows={3} value={urls.join("\n")} onChange={(e) => setUrls(e.target.value.split("\n"))} className={cn(inputClass, "font-mono text-sm")} />
      <label className={cn(buttonClasses("outline", "sm", "mt-2"), "cursor-pointer")}>
        {busy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-4" />}
        {busy ? "Uploading..." : "Upload images"}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" multiple onChange={onFiles} className="sr-only" disabled={busy} />
      </label>
    </FieldShell>
  );
}

/** Markdown textarea with a live preview tab. */
export function MarkdownField({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  const id = useId();
  const error = useFieldError(name);
  const [value, setValue] = useState(defaultValue ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textRef = useRef<HTMLTextAreaElement>(null);

  return (
    <FieldShell id={id} label={label} error={error} hint="Markdown: ## Heading, ### Subheading, **bold**, - list, [link](https://...)" required wide>
      <div className="mb-2 flex gap-1" role="tablist" aria-label="Editor mode">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("min-h-10 rounded-lg px-4 text-sm font-semibold capitalize", tab === t ? "bg-ink text-white" : "text-ink hover:bg-card")}
          >
            {t}
          </button>
        ))}
      </div>
      <textarea
        ref={textRef}
        id={id}
        name={name}
        rows={22}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        hidden={tab !== "write"}
        aria-invalid={Boolean(error)}
        className={cn(inputClass, "font-mono text-[15px] leading-relaxed")}
      />
      {tab === "preview" && (
        <div className="min-h-64 rounded-btn border border-line bg-card p-6">
          {value.trim() ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(value).html }} />
          ) : (
            <p className="text-muted">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </FieldShell>
  );
}
