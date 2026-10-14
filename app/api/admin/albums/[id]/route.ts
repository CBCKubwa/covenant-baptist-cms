import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";

/** Delete a whole album: every photo row, plus every uploaded image file. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const album = await prisma.album.findUnique({ where: { id }, include: { photos: true } });
  if (!album) return NextResponse.json({ error: "Album not found." }, { status: 404 });

  try {
    // Delete photos explicitly first, so this also works on databases that
    // have not yet received the schema's ON DELETE CASCADE.
    await prisma.$transaction([
      prisma.photo.deleteMany({ where: { albumId: id } }),
      prisma.album.delete({ where: { id } }),
    ]);
    await deleteBlobs([...album.photos.map((p) => p.url), album.coverImage]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[albums] delete failed:", error);
    return NextResponse.json({ error: "Could not delete the album." }, { status: 500 });
  }
}
