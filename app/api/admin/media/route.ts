import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanHttpUrl, cleanString, cleanUploadedUrl } from "@/lib/validation";

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  return NextResponse.json(await prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" } }));
}

/** Create a standalone video or audio item (uploaded file OR external link). */
export async function POST(req: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = cleanString(b.title, 200);
  const type = b.type === "AUDIO" ? "AUDIO" : b.type === "VIDEO" ? "VIDEO" : null;
  // An uploaded file wins over a pasted link.
  const url = cleanUploadedUrl(b.fileUrl) ?? cleanHttpUrl(b.link);

  if (!title || !type) return NextResponse.json({ error: "Title and type are required." }, { status: 400 });
  if (!url) return NextResponse.json({ error: "Upload a file or paste a valid link." }, { status: 400 });

  try {
    const item = await prisma.mediaItem.create({
      data: { title, type, url, description: cleanString(b.description) },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[media] create failed:", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
