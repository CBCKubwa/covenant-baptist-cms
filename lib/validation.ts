import { isBlobUrl } from "@/lib/blob";
import { randomBytes } from "crypto";

/** Trim a value to a string, or null when empty / not a string. */
export function cleanString(value: unknown, max = 5000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

/** URL slug such as "walking-in-grace-a1b2". The random tail keeps slugs unique. */
export function uniqueSlug(title: string): string {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item";
  return `${base}-${randomBytes(3).toString("hex")}`;
}

/** Accept only http(s) links (for YouTube / external media). */
export function cleanHttpUrl(value: unknown): string | null {
  const s = cleanString(value, 2000);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Accept only files from our own Blob storage or bundled /public paths. */
export function cleanUploadedUrl(value: unknown): string | null {
  const s = cleanString(value, 2000);
  if (!s) return null;
  if (isBlobUrl(s)) return s;
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  return null;
}

/** Turn "faith, grace ,  hope" into ["faith","grace","hope"] (max 10 short tags). */
export function parseTags(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value.split(",").map((t) => t.trim().slice(0, 30)).filter(Boolean).slice(0, 10);
}

export type MinistrySection = { heading: string; body: string | string[] };

/**
 * Validate the "sections" sent by the ministry form: [{ heading, body: string | string[] }].
 * Empty sections are dropped; text is trimmed and length-limited.
 */
export function parseSections(value: unknown): MinistrySection[] {
  if (!Array.isArray(value)) return [];
  const out: MinistrySection[] = [];
  for (const raw of value.slice(0, 20)) {
    const heading = cleanString((raw as { heading?: unknown })?.heading, 120);
    const body = (raw as { body?: unknown })?.body;
    if (!heading) continue;
    if (Array.isArray(body)) {
      const lines = body.map((l) => cleanString(l, 500)).filter((l): l is string => !!l).slice(0, 40);
      if (lines.length) out.push({ heading, body: lines });
    } else {
      const text = cleanString(body, 5000);
      if (text) out.push({ heading, body: text });
    }
  }
  return out;
}
