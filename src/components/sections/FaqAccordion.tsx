import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/faqs";

/** Native <details> accordion: keyboard and screen reader friendly without JS. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-card">
      {items.map((faq) => (
        <details key={faq.question} className="group px-6 md:px-8 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[17px] font-semibold text-ink md:text-lg">
            {faq.question}
            <Plus
              aria-hidden="true"
              className="size-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="-mt-1 pb-6 leading-relaxed">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
