import Image from "next/image";

/** next/image for local and Vercel Blob photos; a plain img for any other pasted URL. */
export function TeamPhoto({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const optimizable = src.startsWith("/") || /\.public\.blob\.vercel-storage\.com\//.test(src);
  if (optimizable) {
    return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- URL from the admin panel on an unknown host
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  );
}
