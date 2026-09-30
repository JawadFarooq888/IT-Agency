"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { BookCallForm } from "@/components/forms/BookCallForm";
import { WhatsAppLink } from "./TrackedLinks";
import { WhatsAppIcon } from "./BrandIcons";
import { buttonClasses } from "./button-styles";

/** Opens a popup with the consultation booking form (and a WhatsApp option). */
export function BookCallButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Mount the form on first open, and remount it on each open for a fresh state
  const [openCount, setOpenCount] = useState(0);

  function open() {
    trackEvent("book_call_open");
    setOpenCount((n) => n + 1);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" onClick={open} className={className} aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Book a free consultation call"
        onClick={(e) => {
          // Clicking the dark backdrop closes the popup
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-card border border-line bg-card p-0 text-left text-body shadow-float backdrop:bg-ink/50"
      >
        {openCount > 0 && (
          <div className="relative p-5 sm:p-8">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 grid size-11 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <BookCallForm key={openCount} />
            <div className="mt-6 border-t border-line pt-5 text-center">
              <p className="text-[15px] text-muted">Prefer to chat first?</p>
              <WhatsAppLink
                message="Hi, I would like to book a free consultation call."
                className={buttonClasses("outline", "md", "mt-3 w-full")}
              >
                <WhatsAppIcon className="size-5 text-whatsapp" /> Book on WhatsApp instead
              </WhatsAppLink>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
