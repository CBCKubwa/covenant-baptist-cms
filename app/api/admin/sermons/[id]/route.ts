import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";

/** Delete a sermon AND the audio / video / thumbnail files that were uploaded for it. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const sermon = await prisma.sermon.findUnique({ where: { id } });
  if (!sermon) return NextResponse.json({ error: "Sermon not found." }, { status: 404 });

  try {
    await prisma.sermon.delete({ where: { id } });
    await deleteBlobs([sermon.audioUrl, sermon.videoUrl, sermon.thumbnail]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[sermons] delete failed:", error);
    return NextResponse.json({ error: "Could not delete the sermon." }, { status: 500 });
  }
}
