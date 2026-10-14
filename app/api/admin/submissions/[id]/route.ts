import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";

/** Mark a message / prayer request as READ or UNREAD. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const status = body.status === "READ" ? "READ" : body.status === "UNREAD" ? "UNREAD" : null;
  if (!status) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  try {
    await prisma.formSubmission.update({ where: { id }, data: { status } });
    revalidatePath("/admin", "layout"); // refresh the unread badges
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  try {
    await prisma.formSubmission.delete({ where: { id } });
    revalidatePath("/admin", "layout");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found or could not be deleted." }, { status: 404 });
  }
}
