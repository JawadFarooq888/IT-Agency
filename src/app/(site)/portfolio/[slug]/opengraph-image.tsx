import { getCaseStudy } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCaseStudy(slug);
  return renderOgImage({
    eyebrow: "Case study",
    title: item?.title ?? "Our work",
    subtitle: item ? `${item.industry} · ${item.country}. ${item.result}` : undefined,
  });
}
