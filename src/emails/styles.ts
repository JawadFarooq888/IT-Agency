/** Inline styles shared by email templates (email clients ignore stylesheets). */
export const colors = {
  canvas: "#F6F5F1",
  card: "#FFFFFF",
  line: "#E4E2DA",
  ink: "#0F1B2D",
  accent: "#2F5BEA",
  whatsapp: "#0D7A3E",
  body: "#4A5568",
  muted: "#5A6477",
};

export const font =
  "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const main = { backgroundColor: colors.canvas, fontFamily: font, margin: 0, padding: "32px 0" };
export const container = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.line}`,
  borderRadius: "16px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};
export const heading = {
  color: colors.ink,
  fontSize: "22px",
  fontWeight: 700,
  lineHeight: "1.3",
  margin: "0 0 12px",
};
export const text = { color: colors.body, fontSize: "16px", lineHeight: "1.6", margin: "0 0 16px" };
export const small = { color: colors.muted, fontSize: "13px", lineHeight: "1.5", margin: 0 };
export const button = (bg: string) => ({
  backgroundColor: bg,
  borderRadius: "10px",
  color: "#FFFFFF",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 20px",
  textDecoration: "none",
});
