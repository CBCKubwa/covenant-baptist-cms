import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";
import { cleanString, cleanUploadedUrl, parseSections } from "@/lib/validation";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const name = cleanString(b.name, 120);
  const blurb = cleanString(b.blurb, 300);
  if (!name || !blurb) return NextResponse.json({ error: "Name and short blurb are required." }, { status: 400 });

  const existing = await prisma.ministry.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Ministry not found." }, { status: 404 });

  const image = cleanUploadedUrl(b.image);
  const order = Number.isInteger(Number(b.order)) && b.order !== "" && b.order != null ? Number(b.order) : existing.order;

  try {
    const ministry = await prisma.ministry.update({ where: { id }, data: { name, blurb, sections: parseSections(b.sections), image, order } });
    if (existing.image && existing.image !== image) await deleteBlobs([existing.image]);
    revalidatePath("/", "layout");
    return NextResponse.json(ministry);
  } catch (error) {
    console.error("[ministries] update failed:", error);
    return NextResponse.json({ error: "Could not save the ministry." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const ministry = await prisma.ministry.findUnique({ where: { id } });
  if (!ministry) return NextResponse.json({ error: "Ministry not found." }, { status: 404 });

  try {
    await prisma.ministry.delete({ where: { id } });
    await deleteBlobs([ministry.image]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ministries] delete failed:", error);
    return NextResponse.json({ error: "Could not delete the ministry." }, { status: 500 });
  }
}
