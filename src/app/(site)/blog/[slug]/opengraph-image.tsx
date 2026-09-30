import { getPost } from "@/lib/content";
import { readingTime } from "@/lib/markdown";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Blog article";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return renderOgImage({
    eyebrow: post?.category?.name ?? "Blog",
    title: post?.title ?? "Blog",
    subtitle: post ? `${post.authorName} · ${readingTime(post.content)} min read` : undefined,
  });
}
