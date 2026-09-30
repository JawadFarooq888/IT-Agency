import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  // Keep preview deployments out of search results
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return {
    rules: isProduction
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
