export function formatDateTime(d: Date): string {
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: process.env.ADMIN_TIMEZONE ?? "Asia/Karachi",
  });
}
