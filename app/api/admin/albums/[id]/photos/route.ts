import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanString, cleanUploadedUrl } from "@/lib/validation";

/** Attach already-uploaded photos (their Blob URLs) to an album. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  let b: { photos?: Array<{ url?: unknown; caption?: unknown }> };
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const photos = (Array.isArray(b.photos) ? b.photos : [])
    .slice(0, 50)
    .map((p) => ({ url: cleanUploadedUrl(p.url), caption: cleanString(p.caption, 300) }))
    .filter((p): p is { url: string; caption: string | null } => !!p.url);

  if (photos.length === 0) return NextResponse.json({ error: "No valid photos supplied." }, { status: 400 });

  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) return NextResponse.json({ error: "Album not found." }, { status: 404 });

  try {
    // Put new photos after the existing ones.
    const last = await prisma.photo.aggregate({ where: { albumId: id }, _max: { order: true } });
    const start = (last._max.order ?? -1) + 1;

    await prisma.photo.createMany({
      data: photos.map((p, i) => ({ albumId: id, url: p.url, caption: p.caption, order: start + i })),
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, added: photos.length }, { status: 201 });
  } catch (error) {
    console.error("[photos] add failed:", error);
    return NextResponse.json({ error: "Could not add photos." }, { status: 500 });
  }
}
