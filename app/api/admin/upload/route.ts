import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAdminSession, unauthorized } from "@/lib/auth";

/**
 * Issues short-lived upload tokens so the browser can send big files (sermon
 * audio/video) straight to Vercel Blob. Files never pass through this server,
 * which sidesteps Vercel's 4.5 MB request-body limit.
 *
 * Only a signed-in admin can get a token, and each token is locked to the file
 * types and maximum size allowed for that kind of upload.
 */
const RULES = {
  image: {
    maxBytes: 10 * 1024 * 1024, // 10 MB
    types: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
  },
  audio: {
    maxBytes: 200 * 1024 * 1024, // 200 MB
    types: [
      "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac",
      "audio/wav", "audio/x-wav", "audio/ogg", "audio/webm",
    ],
  },
  video: {
    maxBytes: 1024 * 1024 * 1024, // 1 GB
    types: ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v", "video/ogg"],
  },
} as const;

export async function POST(request: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const kind = clientPayload as keyof typeof RULES;
        const rule = RULES[kind];
        if (!rule) throw new Error("Unknown upload type.");

        return {
          allowedContentTypes: [...rule.types],
          maximumSizeInBytes: rule.maxBytes,
          addRandomSuffix: true, // never overwrite an existing file
        };
      },
      // No onUploadCompleted callback: the form saves the returned URL itself.
      // (A callback would not work on localhost anyway.)
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[upload] failed:", error);
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
