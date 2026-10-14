import "server-only";
import { del } from "@vercel/blob";

/** True when the URL points at our Vercel Blob store (i.e. a file WE uploaded). */
export function isBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    return new URL(url).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/**
 * Delete uploaded files from storage. Links that are not ours (YouTube, files
 * in /public, ...) are skipped automatically.
 *
 * This is best-effort on purpose: the database record is the source of truth,
 * so a storage hiccup must never stop the admin from deleting an item.
 */
export async function deleteBlobs(urls: Array<string | null | undefined>) {
  const targets = urls.filter((u): u is string => isBlobUrl(u));
  if (targets.length === 0) return;
  try {
    await del(targets);
  } catch (error) {
    console.error("[blob] could not delete files:", targets, error);
  }
}
