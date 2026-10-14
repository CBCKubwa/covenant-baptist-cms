import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";

/** Delete a standalone video/audio item and its uploaded file (external links are left alone). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const item = await prisma.mediaItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });

  try {
    await prisma.mediaItem.delete({ where: { id } });
    await deleteBlobs([item.url]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[media] delete failed:", error);
    return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  }
}
