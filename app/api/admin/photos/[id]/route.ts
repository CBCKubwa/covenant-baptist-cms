import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";

/** Delete a single photo (database row + the uploaded image file). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const photo = await prisma.photo.findUnique({ where: { id }, include: { album: true } });
  if (!photo) return NextResponse.json({ error: "Photo not found." }, { status: 404 });

  try {
    await prisma.photo.delete({ where: { id } });

    // If this photo was the album's cover, clear it so nothing points at a deleted file.
    if (photo.album.coverImage === photo.url) {
      await prisma.album.update({ where: { id: photo.albumId }, data: { coverImage: null } });
    }
    await deleteBlobs([photo.url]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[photos] delete failed:", error);
    return NextResponse.json({ error: "Could not delete the photo." }, { status: 500 });
  }
}
