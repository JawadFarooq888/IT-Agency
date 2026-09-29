/**
 * Default FAQs shown on the home page. Used as seed data; once the
 * database is connected they are managed from /admin/faqs.
 */
export type FaqItem = { question: string; answer: string };

export const defaultFaqs: FaqItem[] = [
  {
    question: "How much does a project cost?",
    answer:
      "It depends on the size of the project. Business websites start from [$X], mobile apps from [$X] and AI chatbots from [$X]. Tell us what you need and we will send a free, fixed price quote within [48] hours.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A business website usually takes [2 to 4] weeks, a mobile app [6 to 12] weeks and an AI chatbot [1 to 3] weeks. You get an exact timeline with your quote.",
  },
  {
    question: "How do payments work?",
    answer:
      "We usually split payments into milestones, for example [50%] to start and [50%] on delivery. We accept bank transfer, [Wise, Payoneer, PayPal] and Upwork.",
  },
  {
    question: "Will you sign an NDA and keep my idea private?",
    answer:
      "Yes. We are happy to sign an NDA before you share any details. Your code, designs and data always belong to you.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Every project includes [30] days of free support to fix any issues. After that you can choose a monthly support plan or contact us only when you need help.",
  },
  {
    question: "Which countries do you work with?",
    answer:
      "We work with small businesses and startups in the US, UK, UAE, Pakistan and other countries. We plan calls around your time zone and reply within 24 hours.",
  },
];
