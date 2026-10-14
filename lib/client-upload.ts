"use client";

import { upload } from "@vercel/blob/client";

export type UploadKind = "image" | "audio" | "video";

/** What each kind accepts in the file picker, and a friendly size limit for the UI. */
export const UPLOAD_INFO: Record<UploadKind, { accept: string; limitLabel: string; noun: string }> = {
  image: { accept: "image/jpeg,image/png,image/webp,image/gif,image/avif", limitLabel: "10 MB", noun: "image" },
  audio: { accept: "audio/*", limitLabel: "200 MB", noun: "audio file" },
  video: { accept: "video/*", limitLabel: "1 GB", noun: "video file" },
};

/**
 * Upload one file straight from the browser to Vercel Blob and return its public URL.
 * The server (/api/admin/upload) only hands out a short-lived, admin-only token.
 */
export async function uploadFile(
  file: File,
  kind: UploadKind,
  onProgress?: (percent: number) => void
): Promise<string> {
  // Keep file names URL-safe; a random suffix is added by the server.
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);

  const blob = await upload(`${kind}s/${safeName}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    clientPayload: kind,
    multipart: kind !== "image", // big audio/video files upload in parallel chunks
    onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
  });
  return blob.url;
}
