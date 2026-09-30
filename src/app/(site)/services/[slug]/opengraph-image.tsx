import { getService, services } from "@/content/services";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Service overview";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderOgImage({
    eyebrow: service?.title ?? "Services",
    title: service?.hero.headline ?? "Our services",
    subtitle: service ? `Starting from ${service.startingPrice}. ${service.benefit}` : undefined,
  });
}
