import type { Config } from "tailwindcss";

/**
 * Design tokens. Change colors, fonts, sizes and radii here and the whole
 * site follows. Loaded from src/app/globals.css via `@config`.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F5F1", // page background
        card: "#FFFFFF",
        line: "#E4E2DA", // card borders and dividers
        ink: {
          DEFAULT: "#0F1B2D", // headings and dark sections
          soft: "#1A2940", // raised surfaces on dark sections
        },
        accent: {
          DEFAULT: "#2F5BEA",
          hover: "#1E3A9E",
        },
        whatsapp: {
          DEFAULT: "#128C4A", // brand green (icons, floating button)
          strong: "#0D7A3E", // text buttons: passes 4.5:1 with white text
          hover: "#0A6532",
        },
        // Icon backgrounds, with a matching foreground ("ink") for the icon itself
        tint: {
          blue: { DEFAULT: "#E6EBFB", ink: "#2F5BEA" },
          orange: { DEFAULT: "#FDEBD9", ink: "#B4570B" },
          green: { DEFAULT: "#E3F1E8", ink: "#0D7A3E" },
        },
        body: "#4A5568",
        muted: "#5A6477",
      },
      fontFamily: {
        display: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Desktop heading sizes plus tablet / mobile steps
        h1: ["64px", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "h1-md": ["52px", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "h1-sm": ["38px", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
        h2: ["46px", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "h2-md": ["38px", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "h2-sm": ["30px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h3: ["21px", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        lead: ["20px", { lineHeight: "1.6" }],
      },
      maxWidth: {
        content: "1248px",
        page: "1440px", // 1248px content + 2 x 96px side padding
      },
      borderRadius: {
        btn: "12px",
        card: "20px",
        "card-sm": "16px",
      },
      boxShadow: {
        float: "0 18px 40px -16px rgba(15, 27, 45, 0.22)",
        "float-sm": "0 8px 24px -10px rgba(15, 27, 45, 0.18)",
      },
    },
  },
};

export default config;
