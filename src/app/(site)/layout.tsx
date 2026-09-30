import { SiteChrome } from "@/components/layout/SiteChrome";

// Admin saves refresh pages right away with revalidatePath. This is a safety net:
// every public page is rebuilt with fresh settings and content at least every 5 minutes.
export const revalidate = 300;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
