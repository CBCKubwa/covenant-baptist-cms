import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanHttpUrl, cleanString, cleanUploadedUrl, uniqueSlug } from "@/lib/validation";

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  const sermons = await prisma.sermon.findMany({
    include: { speaker: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(sermons);
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
  const speakerName = cleanString(b.speakerName, 120);
  const scripture = cleanString(b.scripture, 200);
  if (!title || !speakerName || !scripture) {
    return NextResponse.json({ error: "Title, speaker and scripture are required." }, { status: 400 });
  }

  const date = b.date ? new Date(String(b.date)) : new Date();
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  try {
    // Re-use the speaker if the name already exists, otherwise create them.
    const speaker =
      (await prisma.speaker.findFirst({ where: { name: speakerName } })) ??
      (await prisma.speaker.create({ data: { name: speakerName } }));

    const sermon = await prisma.sermon.create({
      data: {
        title,
        slug: uniqueSlug(title),
        speakerId: speaker.id,
        scripture,
        category: cleanString(b.category, 80),
        description: cleanString(b.description),
        date,
        publishedAt: new Date(),
        audioUrl: cleanUploadedUrl(b.audioUrl),
        videoUrl: cleanUploadedUrl(b.videoUrl),
        youtubeUrl: cleanHttpUrl(b.youtubeUrl),
        quote: cleanString(b.quote),
        question: cleanString(b.question),
        prayer: cleanString(b.prayer),
      },
      include: { speaker: true },
    });

    revalidatePath("/", "layout");
    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    console.error("[sermons] create failed:", error);
    return NextResponse.json({ error: "Could not save the sermon." }, { status: 500 });
  }
}
