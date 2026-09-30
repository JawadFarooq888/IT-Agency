import { site } from "@/content/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = `${site.name}: websites, apps and AI tools for growing businesses`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Software, AI and digital growth",
    title: site.tagline,
    subtitle: "Fixed price quotes. Weekly updates. Replies within 24 hours.",
  });
}
