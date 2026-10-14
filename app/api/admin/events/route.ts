import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanHttpUrl, cleanString, uniqueSlug } from "@/lib/validation";

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  return NextResponse.json(await prisma.event.findMany({ orderBy: { startsAt: "asc" } }));
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = cleanString(b.title, 200);
  const startsAt = new Date(String(b.startsAt || b.date || ""));
  if (!title || Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "Event title and a valid date are required." }, { status: 400 });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        slug: uniqueSlug(title),
        startsAt,
        startTime: cleanString(b.time ?? b.startTime, 20),
        location: cleanString(b.location, 200),
        description: cleanString(b.description),
        registrationUrl: cleanHttpUrl(b.registrationUrl),
        category: cleanString(b.category, 80),
        status: "PUBLISHED",
      },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("[events] create failed:", error);
    return NextResponse.json({ error: "Could not save the event." }, { status: 500 });
  }
}
