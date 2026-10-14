import "server-only";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Small database-backed rate limiter. (In-memory counters do not work on Vercel,
 * because each request may run in a different short-lived server instance.)
 *
 * Every function FAILS OPEN: if the database or the RateLimit table is
 * unavailable, we log and allow the request rather than locking everyone out.
 */

/** Best-effort client IP from request headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: Headers | Record<string, string | string[] | undefined> | undefined): string {
  const get = (name: string): string | undefined => {
    if (!headers) return undefined;
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    const v = headers[name];
    return Array.isArray(v) ? v[0] : v;
  };
  const forwarded = get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || get("x-real-ip") || "unknown";
}

/** Hash identifiers so raw IP addresses / usernames are never stored. */
export function limiterKey(...parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 32);
}

/** True when `key` has already reached `limit` hits inside its current window. */
export async function isLimited(key: string, limit: number): Promise<boolean> {
  try {
    const row = await prisma.rateLimit.findUnique({ where: { key } });
    return !!row && row.resetAt > new Date() && row.count >= limit;
  } catch (error) {
    console.error("[rate-limit] check failed (allowing):", error);
    return false;
  }
}

/** Count one hit. The first hit opens a new window of `windowSeconds`. */
export async function recordHit(key: string, windowSeconds: number): Promise<void> {
  try {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowSeconds * 1000);
    const row = await prisma.rateLimit.findUnique({ where: { key } });

    if (!row || row.resetAt <= now) {
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, resetAt },
        create: { key, count: 1, resetAt },
      });
    } else {
      await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
    }

    // Occasional housekeeping so the table never grows.
    if (Math.random() < 0.02) await prisma.rateLimit.deleteMany({ where: { resetAt: { lt: now } } });
  } catch (error) {
    console.error("[rate-limit] record failed:", error);
  }
}

/** Forget a key (used after a successful login). */
export async function clearHits(key: string): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({ where: { key } });
  } catch (error) {
    console.error("[rate-limit] clear failed:", error);
  }
}
