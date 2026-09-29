/**
 * Placeholder testimonials. Replace with real client reviews only.
 * Once the database is connected they are managed from /admin/testimonials.
 */
export type TestimonialItem = {
  name: string;
  role: string;
  company: string;
  country: string;
  quote: string;
};

export const defaultTestimonials: TestimonialItem[] = [
  {
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
    country: "[Country]",
    quote:
      "[Paste a real review from a client here. Two or three sentences about the problem you solved and the result they got.]",
  },
  {
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
    country: "[Country]",
    quote:
      "[Paste a real review from a client here. Mention what it was like to work with you and how fast you delivered.]",
  },
  {
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
    country: "[Country]",
    quote:
      "[Paste a real review from a client here. Upwork reviews work well, copied word for word with permission.]",
  },
];
