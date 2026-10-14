import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  try {
    await prisma.weeklyWord.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Entry not found or could not be deleted." }, { status: 404 });
  }
}
