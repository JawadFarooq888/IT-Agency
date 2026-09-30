import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Branded 1200x630 social image. Colors match tailwind.config.ts. */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const clipped = title.length > 90 ? `${title.slice(0, 87)}...` : title;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#F6F5F1",
        padding: "72px 80px",
        color: "#0F1B2D",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            backgroundColor: "#0F1B2D",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          {site.name.charAt(0)}
        </div>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
          {site.name}
          <span style={{ color: "#2F5BEA" }}>.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow && (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              color: "#2F5BEA",
              marginBottom: 20,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            display: "flex",
            fontSize: clipped.length > 55 ? 58 : 70,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {clipped}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#4A5568",
              marginTop: 24,
              maxWidth: 960,
              lineHeight: 1.4,
            }}
          >
            {subtitle.length > 140 ? `${subtitle.slice(0, 137)}...` : subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "2px solid #E4E2DA",
          paddingTop: 28,
          fontSize: 24,
          color: "#5A6477",
        }}
      >
        <span>{site.domain}</span>
        <span
          style={{
            display: "flex",
            backgroundColor: "#2F5BEA",
            color: "#FFFFFF",
            borderRadius: 12,
            padding: "12px 24px",
            fontWeight: 600,
          }}
        >
          Get a free quote
        </span>
      </div>
    </div>,
    ogSize,
  );
}
