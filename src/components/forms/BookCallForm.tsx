"use client";

import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarCheck, Loader2 } from "lucide-react";
import { submitBooking } from "@/app/actions/booking";
import {
  bookingSchema,
  isoDate,
  timeSlots,
  type BookingInput,
  type BookingValues,
} from "@/lib/validations/booking";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button-styles";
import { inputClass, labelClass } from "@/components/ui/form-styles";
import { WhatsAppLink } from "@/components/ui/TrackedLinks";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Turnstile, turnstileSiteKey } from "./Turnstile";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
      <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
      {message}
    </p>
  );
}

/** Short form to request a free consultation call. Saved as a lead. */
export function BookCallForm({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const uid = useId();
  const [minDate] = useState(() => isoDate(0));
  const [maxDate] = useState(() => isoDate(90));
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<{ name: string; when: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput, unknown, BookingValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      preferredDate: "",
      note: "",
      timezone: "",
      website: "",
    },
  });
  const timeSlot = useWatch({ control, name: "timeSlot" });

  async function onSubmit(values: BookingValues) {
    setFormError(null);
    if (turnstileSiteKey && !turnstileToken) {
      setFormError("Please complete the security check above the button.");
      return;
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const attribution = getAttribution();
    const result = await submitBooking(
      { ...values, timezone },
      {
        turnstileToken: turnstileToken ?? undefined,
        sourcePage: window.location.pathname,
        referrer: attribution.referrer,
        utm: attribution.utm,
      },
    ).catch(() => ({
      ok: false as const,
      error: "Network error. Please check your connection and try again.",
    }));

    if (result.ok) {
      trackEvent("consultation_booked", { time_slot: values.timeSlot });
      setDone({
        name: values.fullName.split(" ")[0] ?? "",
        when: `${values.preferredDate}, ${values.timeSlot}`,
      });
      reset();
      return;
    }
    setFormError(result.error);
    if ("fieldErrors" in result && result.fieldErrors) {
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        if (message) setError(key as keyof BookingInput, { message });
      }
    }
    setTurnstileToken(null);
    setTurnstileReset((n) => n + 1);
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col items-center py-8 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-tint-green text-tint-green-ink">
          <CalendarCheck aria-hidden="true" className="size-8" />
        </span>
        <Heading className="heading-3 mt-6 text-2xl">
          Thanks{done.name ? `, ${done.name}` : ""}! Your call request is in.
        </Heading>
        <p className="mt-3 max-w-md text-lg">
          You asked for <strong className="text-ink">{done.when}</strong>. We will confirm the exact time on
          WhatsApp or by email within 24 hours.
        </p>
        <WhatsAppLink
          message={`Hi, I just booked a free consultation call for ${done.when}.`}
          className={buttonClasses("whatsapp", "lg", "mt-8")}
        >
          <WhatsAppIcon className="size-5" /> Confirm faster on WhatsApp
        </WhatsAppLink>
      </div>
    );
  }

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: string) => `${uid}-${k}-error`;

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
      {/* Right padding keeps the title clear of the popup's close button */}
      <Heading className="heading-3 pr-10 text-2xl">Book a free consultation call</Heading>
      <p className="mt-1.5 text-[15px] text-muted">
        20 minutes on WhatsApp or Google Meet. Pick a day and time that suits you.
      </p>

      {formError && (
        <div
          role="alert"
          className="mt-5 flex gap-3 rounded-btn border border-red-200 bg-red-50 p-4 text-[15px] text-red-800"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={labelClass}>
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("name")}
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? err("name") : undefined}
            {...register("fullName")}
          />
          <ErrorText id={err("name")} message={errors.fullName?.message} />
        </div>
        <div>
          <label htmlFor={id("email")} className={labelClass}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? err("email") : undefined}
            {...register("email")}
          />
          <ErrorText id={err("email")} message={errors.email?.message} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={id("phone")} className={labelClass}>
            WhatsApp number <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+1 555 123 4567"
            className={inputClass}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? err("phone") : undefined}
            {...register("phone")}
          />
          <ErrorText id={err("phone")} message={errors.phone?.message} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={id("date")} className={labelClass}>
            Preferred date <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("date")}
            type="date"
            min={minDate}
            max={maxDate}
            className={inputClass}
            aria-invalid={!!errors.preferredDate}
            aria-describedby={errors.preferredDate ? err("date") : undefined}
            {...register("preferredDate")}
          />
          <ErrorText id={err("date")} message={errors.preferredDate?.message} />
        </div>
        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>
            Preferred time <span className="font-normal text-muted">(your local time)</span>{" "}
            <span aria-hidden="true">*</span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {timeSlots.map((slot) => {
              const checked = timeSlot === slot;
              return (
                <label
                  key={slot}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center justify-center rounded-btn border px-3 text-center text-[15px] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    checked
                      ? "border-accent bg-tint-blue text-accent-hover"
                      : "border-line bg-card text-ink hover:border-ink/40",
                  )}
                >
                  <input
                    type="radio"
                    name={id("slot")}
                    value={slot}
                    checked={checked}
                    onChange={() => setValue("timeSlot", slot, { shouldValidate: true })}
                    className="sr-only"
                  />
                  {slot}
                </label>
              );
            })}
          </div>
          <ErrorText id={err("slot")} message={errors.timeSlot?.message} />
        </fieldset>
        <div className="sm:col-span-2">
          <label htmlFor={id("note")} className={labelClass}>
            What would you like to discuss? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id={id("note")}
            rows={3}
            className={cn(inputClass, "resize-y")}
            aria-invalid={!!errors.note}
            aria-describedby={errors.note ? err("note") : undefined}
            {...register("note")}
          />
          <ErrorText id={err("note")} message={errors.note?.message} />
        </div>

        {/* Honeypot: hidden from people and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id("website")}>Website</label>
          <input id={id("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <div className="sm:col-span-2">
          <Turnstile onToken={setTurnstileToken} resetKey={turnstileReset} />
        </div>

        <div className="sm:col-span-2">
          <button type="submit" disabled={isSubmitting} className={buttonClasses("primary", "lg", "w-full")}>
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="size-5 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <CalendarCheck aria-hidden="true" className="size-5" /> Request my call
              </>
            )}
          </button>
          <p className="mt-3 text-center text-sm text-muted">
            Free, no obligation. We confirm within 24 hours.
          </p>
        </div>
      </div>
    </form>
  );
}
