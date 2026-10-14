import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanString } from "@/lib/validation";
import { startOfWeek } from "@/lib/week";

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  return NextResponse.json(await prisma.weeklyWord.findMany({ orderBy: { date: "desc" } }));
}

/**
 * Create or replace the Weekly Word. The admin picks ANY date inside the week;
 * it is normalised to that week's Monday, so there is exactly one entry per week.
 */
export async function POST(request: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const picked = new Date(`${String(b.date || "")}T00:00:00Z`);
  const quote = cleanString(b.quote);
  const question = cleanString(b.question);
  const prayer = cleanString(b.prayer);
  if (Number.isNaN(picked.getTime()) || !quote || !question || !prayer) {
    return NextResponse.json({ error: "Week, quote, question and prayer are required." }, { status: 400 });
  }

  const date = startOfWeek(picked);
  const fields = { quote, question, prayer, quoteBy: cleanString(b.quoteBy, 120), scripture: cleanString(b.scripture, 200) };

  try {
    const row = await prisma.weeklyWord.upsert({ where: { date }, update: fields, create: { date, ...fields } });
    revalidatePath("/", "layout");
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("[weekly-word] save failed:", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
