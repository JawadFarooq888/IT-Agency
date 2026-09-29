import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db, isDbConfigured } from "./db";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

/** One-way hash so we can rate limit without storing raw IP addresses. */
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

// Fallback for local development without a database
const memoryHits = new Map<string, number[]>();

/**
 * Sliding window rate limit. Records a hit and returns false when the key
 * has already reached `limit` hits within `windowMs`.
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);

  if (!isDbConfigured) {
    const hits = (memoryHits.get(key) ?? []).filter((t) => t > since.getTime());
    if (hits.length >= limit) return false;
    memoryHits.set(key, [...hits, Date.now()]);
    return true;
  }

  const count = await db.rateLimitHit.count({ where: { key, createdAt: { gt: since } } });
  if (count >= limit) return false;
  await db.rateLimitHit.create({ data: { key } });
  // Occasional cleanup of old rows
  if (Math.random() < 0.05) {
    await db.rateLimitHit.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
  }
  return true;
}

/** Verifies a Cloudflare Turnstile token. Skipped when no secret key is set (local dev). */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production" || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
