import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanString, cleanUploadedUrl, parseSections, uniqueSlug } from "@/lib/validation";

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  return NextResponse.json(await prisma.ministry.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }));
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = cleanString(b.name, 120);
  const blurb = cleanString(b.blurb, 300);
  if (!name || !blurb) return NextResponse.json({ error: "Name and short blurb are required." }, { status: 400 });

  try {
    // New ministries go to the end of the list unless an order is given.
    const last = await prisma.ministry.aggregate({ _max: { order: true } });
    const order = Number.isInteger(Number(b.order)) && b.order !== "" && b.order != null ? Number(b.order) : (last._max.order ?? -1) + 1;

    const ministry = await prisma.ministry.create({
      data: { name, slug: uniqueSlug(name), blurb, sections: parseSections(b.sections), image: cleanUploadedUrl(b.image), order },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(ministry, { status: 201 });
  } catch (error) {
    console.error("[ministries] create failed:", error);
    return NextResponse.json({ error: "Could not save the ministry." }, { status: 500 });
  }
}
