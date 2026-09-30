import { z } from "zod";

/** Service label used for call bookings in the leads table. */
export const CONSULTATION_SERVICE = "Consultation call";

/** Time windows, shown in the visitor's own time zone. */
export const timeSlots = [
  "Morning (9am to 12pm)",
  "Afternoon (12pm to 5pm)",
  "Evening (5pm to 9pm)",
] as const;

const DAY = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD for today + `offsetDays` in the given time (defaults to now). */
export function isoDate(offsetDays = 0, from: number = Date.now()): string {
  return new Date(from + offsetDays * DAY).toISOString().slice(0, 10);
}

/** Booking form. Same schema validates in the browser and in the server action. */
export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100, "Name is too long."),
  email: z.string().trim().max(200).pipe(z.email("Please enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .max(25)
    .refine(
      (v) => /^\+?[0-9\s()-]{6,20}$/.test(v),
      "Please enter your WhatsApp or phone number with country code.",
    ),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date.")
    // Allow one day of slack for time zones
    .refine((v) => v >= isoDate(-1) && v <= isoDate(90), "Please choose a date within the next 90 days."),
  timeSlot: z.enum(timeSlots, "Please choose a time."),
  note: z.string().trim().max(1000, "Please keep the note under 1000 characters."),
  timezone: z.string().max(80),
  /** Honeypot: real users never see or fill this */
  website: z.string().max(200).optional(),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingValues = z.output<typeof bookingSchema>;

export type BookingResult =
  { ok: true } | { ok: false; error: string; fieldErrors?: Partial<Record<keyof BookingInput, string>> };
