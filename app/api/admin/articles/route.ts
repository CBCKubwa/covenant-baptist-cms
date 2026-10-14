import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanString, cleanUploadedUrl, parseTags, uniqueSlug } from "@/lib/validation";

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  return NextResponse.json(await prisma.article.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = cleanString(b.title, 200);
  const content = cleanString(b.content, 100_000);
  if (!title || !content) return NextResponse.json({ error: "Title and content are required." }, { status: 400 });

  try {
    const article = await prisma.article.create({
      data: {
        title,
        slug: uniqueSlug(title),
        content,
        author: cleanString(b.author, 120),
        category: cleanString(b.category, 80),
        tags: parseTags(b.tags),
        featuredImage: cleanUploadedUrl(b.featuredImage),
        publishedAt: new Date(),
      },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("[articles] create failed:", error);
    return NextResponse.json({ error: "Could not save the article." }, { status: 500 });
  }
}
