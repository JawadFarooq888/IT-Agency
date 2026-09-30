"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Paperclip, Send, X } from "lucide-react";
import { serviceOptions } from "@/content/services";
import {
  budgetOptions,
  countryCodes,
  quoteFormSchema,
  timelineOptions,
  validateAttachment,
  type QuoteFormInput,
  type QuoteFormValues,
  type QuoteMeta,
} from "@/lib/validations/quote";
import { submitQuote } from "@/app/actions/quote";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button-styles";
import { inputClass } from "@/components/ui/form-styles";
import { WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Turnstile, turnstileSiteKey } from "./Turnstile";

function FieldErrorText({ id, error }: { id: string; error?: FieldError | { message?: string } }) {
  if (!error?.message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
      <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
      {error.message}
    </p>
  );
}

function Chips<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly T[];
  value?: T;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[15px] font-semibold text-ink">
        {legend} <span className="font-normal text-muted">(optional)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              className={cn(
                "relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[15px] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                checked
                  ? "border-accent bg-tint-blue text-accent-hover"
                  : "border-line bg-card text-ink hover:border-ink/40",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={checked}
                // Clicking the selected chip again clears it
                onClick={() => checked && onChange(undefined)}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type Status = "idle" | "uploading" | "sending" | "success";

export function QuoteForm({
  defaultService,
  headingLevel = "h2",
}: {
  defaultService?: string;
  /** Use h3 when the form sits under a section h2 */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const uid = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedService, setSubmittedService] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<QuoteFormInput, unknown, QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phoneCountry: "US",
      phone: "",
      company: "",
      service: defaultService && serviceOptions.includes(defaultService) ? defaultService : "",
      details: "",
      website: "",
    },
  });

  const details = useWatch({ control, name: "details" }) ?? "";
  const budget = useWatch({ control, name: "budget" });
  const timeline = useWatch({ control, name: "timeline" });
  const busy = status === "uploading" || status === "sending";

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const err = validateAttachment(f);
    setFileError(err);
    setFile(err ? null : f);
    if (err && fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearFile() {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(values: QuoteFormValues) {
    setFormError(null);
    if (turnstileSiteKey && !turnstileToken) {
      setFormError("Please complete the security check above the button.");
      return;
    }

    let attachment: QuoteMeta["attachment"];
    try {
      if (file) {
        setStatus("uploading");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
        // Loaded only when a file is attached, to keep the page light
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(`leads/${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: file.type || undefined,
        });
        attachment = { url: blob.url, name: file.name.slice(0, 255), size: file.size };
      }
    } catch {
      setStatus("idle");
      setFileError("We could not upload your file. Remove it and try again, or send it by email later.");
      return;
    }

    setStatus("sending");
    const attribution = getAttribution();
    const result = await submitQuote(values, {
      turnstileToken: turnstileToken ?? undefined,
      attachment,
      sourcePage: window.location.pathname,
      referrer: attribution.referrer,
      utm: attribution.utm,
    }).catch(() => ({
      ok: false as const,
      error: "Network error. Please check your connection and try again.",
    }));

    if (result.ok) {
      trackEvent("quote_form_submit", { service: values.service, budget: values.budget ?? "not set" });
      setSubmittedName(values.fullName.split(" ")[0] ?? "");
      setSubmittedService(values.service === "Other" ? undefined : values.service);
      setStatus("success");
      reset();
      clearFile();
      return;
    }

    setStatus("idle");
    setFormError(result.error);
    if ("fieldErrors" in result && result.fieldErrors) {
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        if (message) setError(key as keyof QuoteFormInput, { message });
      }
    }
    // Tokens are single use: get a fresh one
    setTurnstileToken(null);
    setTurnstileReset((n) => n + 1);
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center py-10 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-tint-green text-tint-green-ink">
          <CheckCircle2 aria-hidden="true" className="size-8" />
        </span>
        <Heading className="heading-3 mt-6 text-2xl">
          Thanks{submittedName ? `, ${submittedName}` : ""}! Your request is in.
        </Heading>
        <p className="mt-3 max-w-md text-lg">
          We will reply within 24 hours. We also sent a confirmation to your email. Want a faster answer?
          Message us on WhatsApp now.
        </p>
        <WhatsAppLink service={submittedService} className={buttonClasses("whatsapp", "lg", "mt-8")}>
          <WhatsAppIcon className="size-5" /> Chat on WhatsApp now
        </WhatsAppLink>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setTurnstileReset((n) => n + 1);
          }}
          className="mt-4 min-h-11 text-[15px] font-medium text-accent underline-offset-4 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    phone: `${uid}-phone`,
    country: `${uid}-country`,
    company: `${uid}-company`,
    service: `${uid}-service`,
    details: `${uid}-details`,
    file: `${uid}-file`,
    consent: `${uid}-consent`,
  };
  const err = (k: string) => `${uid}-${k}-error`;

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      noValidate
      aria-describedby={formError ? `${uid}-form-error` : undefined}
    >
      <Heading className="heading-3 text-2xl">Get a free quote</Heading>
      <p className="mt-1.5 text-[15px] text-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {formError && (
        <div
          id={`${uid}-form-error`}
          role="alert"
          className="mt-5 flex gap-3 rounded-btn border border-red-200 bg-red-50 p-4 text-[15px] text-red-800"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className="mb-1.5 block text-[15px] font-semibold text-ink">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id={ids.name}
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-invalid={!!errors.fullName}
            aria-required="true"
            aria-describedby={errors.fullName ? err("name") : undefined}
            {...register("fullName")}
          />
          <FieldErrorText id={err("name")} error={errors.fullName} />
        </div>

        <div>
          <label htmlFor={ids.email} className="mb-1.5 block text-[15px] font-semibold text-ink">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={ids.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            aria-invalid={!!errors.email}
            aria-required="true"
            aria-describedby={errors.email ? err("email") : undefined}
            {...register("email")}
          />
          <FieldErrorText id={err("email")} error={errors.email} />
        </div>

        <div>
          <label htmlFor={ids.phone} className="mb-1.5 block text-[15px] font-semibold text-ink">
            WhatsApp / phone <span className="font-normal text-muted">(optional)</span>
          </label>
          <div className="flex gap-2">
            <select
              id={ids.country}
              aria-label="Country code"
              autoComplete="tel-country-code"
              className={cn(inputClass, "w-[108px] shrink-0 px-3")}
              {...register("phoneCountry")}
            >
              {countryCodes.map((c) => (
                <option key={c.iso} value={c.iso} title={c.label}>
                  {c.iso === "OTHER" ? "Other" : `${c.iso} ${c.dial}`}
                </option>
              ))}
            </select>
            <input
              id={ids.phone}
              type="tel"
              autoComplete="tel-national"
              inputMode="tel"
              className={inputClass}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? err("phone") : undefined}
              {...register("phone")}
            />
          </div>
          <FieldErrorText id={err("phone")} error={errors.phone} />
        </div>

        <div>
          <label htmlFor={ids.company} className="mb-1.5 block text-[15px] font-semibold text-ink">
            Company name <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id={ids.company}
            type="text"
            autoComplete="organization"
            className={inputClass}
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? err("company") : undefined}
            {...register("company")}
          />
          <FieldErrorText id={err("company")} error={errors.company} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={ids.service} className="mb-1.5 block text-[15px] font-semibold text-ink">
            Service needed <span aria-hidden="true">*</span>
          </label>
          <select
            id={ids.service}
            className={inputClass}
            aria-invalid={!!errors.service}
            aria-required="true"
            aria-describedby={errors.service ? err("service") : undefined}
            {...register("service")}
          >
            <option value="" disabled>
              Choose a service
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldErrorText id={err("service")} error={errors.service} />
        </div>

        <div className="sm:col-span-2">
          <Chips
            legend="Budget range"
            name={`${uid}-budget`}
            options={budgetOptions}
            value={budget}
            onChange={(v) => setValue("budget", v, { shouldDirty: true })}
          />
        </div>

        <div className="sm:col-span-2">
          <Chips
            legend="Timeline"
            name={`${uid}-timeline`}
            options={timelineOptions}
            value={timeline}
            onChange={(v) => setValue("timeline", v, { shouldDirty: true })}
          />
        </div>

        <div className="sm:col-span-2">
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <label htmlFor={ids.details} className="block text-[15px] font-semibold text-ink">
              Project details <span aria-hidden="true">*</span>
            </label>
            <span
              className={cn("text-sm", details.trim().length < 20 ? "text-muted" : "text-tint-green-ink")}
            >
              {details.trim().length} / 20 min
            </span>
          </div>
          <textarea
            id={ids.details}
            rows={5}
            placeholder="What do you want to build? Who is it for? Any links or examples you like?"
            className={cn(inputClass, "min-h-32 resize-y")}
            aria-invalid={!!errors.details}
            aria-required="true"
            aria-describedby={errors.details ? err("details") : undefined}
            {...register("details")}
          />
          <FieldErrorText id={err("details")} error={errors.details} />
        </div>

        <div className="sm:col-span-2">
          <span className="mb-1.5 block text-[15px] font-semibold text-ink" id={`${ids.file}-label`}>
            Attachment <span className="font-normal text-muted">(optional)</span>
          </span>
          {file ? (
            <div className="flex min-h-12 items-center gap-3 rounded-btn border border-line bg-canvas px-4 py-2">
              <Paperclip aria-hidden="true" className="size-4 shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate text-[15px] text-ink">{file.name}</span>
              <span className="shrink-0 text-sm text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              <button
                type="button"
                onClick={clearFile}
                className="-mr-2 grid size-11 shrink-0 place-items-center rounded-lg text-muted hover:text-ink"
                aria-label={`Remove ${file.name}`}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor={ids.file}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-btn border border-dashed border-ink/25 bg-canvas px-4 py-3 text-[15px] text-body transition-colors hover:border-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <Paperclip aria-hidden="true" className="size-4 shrink-0 text-muted" />
              <span>
                <span className="font-semibold text-accent">Choose a file</span> · PDF, DOC, DOCX, PNG or JPG,
                max 10MB
              </span>
              <input
                ref={fileInputRef}
                id={ids.file}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={onFileChange}
                className="sr-only"
                aria-describedby={fileError ? err("file") : undefined}
              />
            </label>
          )}
          <FieldErrorText id={err("file")} error={fileError ? { message: fileError } : undefined} />
        </div>

        {/* Honeypot: hidden from people and screen readers, bots fill it in */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input
            id={`${uid}-website`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id={ids.consent}
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-accent"
              aria-invalid={!!errors.consent}
              aria-required="true"
              aria-describedby={errors.consent ? err("consent") : undefined}
              {...register("consent")}
            />
            <label htmlFor={ids.consent} className="cursor-pointer text-[15px] leading-snug">
              I agree to the{" "}
              <Link href="/privacy-policy" className="font-medium text-accent underline underline-offset-2">
                privacy policy
              </Link>{" "}
              and agree to be contacted about my request. <span aria-hidden="true">*</span>
            </label>
          </div>
          <FieldErrorText id={err("consent")} error={errors.consent} />
        </div>

        <div className="sm:col-span-2">
          <Turnstile onToken={setTurnstileToken} resetKey={turnstileReset} />
        </div>

        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className={buttonClasses("primary", "lg", "w-full")}>
            {busy ? (
              <>
                <Loader2 aria-hidden="true" className="size-5 animate-spin" />
                {status === "uploading" ? "Uploading file..." : "Sending..."}
              </>
            ) : (
              <>
                Send my request <Send aria-hidden="true" className="size-5" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-sm text-muted">
            Free quote, no obligation. We reply within 24 hours.
          </p>
        </div>
      </div>
    </form>
  );
}
