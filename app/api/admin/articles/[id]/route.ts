import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";
import { cleanString, cleanUploadedUrl, parseTags } from "@/lib/validation";

/** Edit an article. A replaced featured image is removed from storage. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const title = cleanString(b.title, 200);
  const content = cleanString(b.content, 100_000);
  if (!title || !content) return NextResponse.json({ error: "Title and content are required." }, { status: 400 });

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Article not found." }, { status: 404 });

  const featuredImage = cleanUploadedUrl(b.featuredImage);
  try {
    const article = await prisma.article.update({
      where: { id },
      data: { title, content, author: cleanString(b.author, 120), category: cleanString(b.category, 80), tags: parseTags(b.tags), featuredImage },
    });
    if (existing.featuredImage && existing.featuredImage !== featuredImage) await deleteBlobs([existing.featuredImage]);
    revalidatePath("/", "layout");
    return NextResponse.json(article);
  } catch (error) {
    console.error("[articles] update failed:", error);
    return NextResponse.json({ error: "Could not save the article." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 });

  try {
    await prisma.article.delete({ where: { id } });
    await deleteBlobs([article.featuredImage]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[articles] delete failed:", error);
    return NextResponse.json({ error: "Could not delete the article." }, { status: 500 });
  }
}
