import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanString, cleanUploadedUrl } from "@/lib/validation";

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  return NextResponse.json(
    await prisma.album.findMany({ include: { _count: { select: { photos: true } } }, orderBy: { createdAt: "desc" } })
  );
}

/** Create an empty album. Photos are added afterwards from the album's own page. */
export async function POST(req: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = cleanString(b.title, 200);
  if (!title) return NextResponse.json({ error: "Album title is required." }, { status: 400 });

  let date: Date | null = null;
  if (b.date) {
    date = new Date(String(b.date));
    if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  try {
    const album = await prisma.album.create({
      data: {
        title,
        date,
        description: cleanString(b.description),
        coverImage: cleanUploadedUrl(b.coverImage),
      },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error("[albums] create failed:", error);
    return NextResponse.json({ error: "Could not create the album." }, { status: 500 });
  }
}
