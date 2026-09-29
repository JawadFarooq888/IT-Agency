import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Catches every unmatched URL and shows the 404 inside the normal site frame. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
