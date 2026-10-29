import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { cleanHttpUrl, cleanString } from "@/lib/validation";
import { getVideoEmbed } from "@/lib/live";
const ID = "singleton";
export async function GET() { if (!(await getAdminSession())) return unauthorized(); return NextResponse.json(await prisma.liveStream.findUnique({ where: { id: ID } })); }
export async function PUT(req: Request) {
  if (!(await getAdminSession())) return unauthorized();
  let body: Record<string, unknown>; try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const title = cleanString(body.title, 150) ?? "Live Service"; const description = cleanString(body.description, 1000);
  const rawLink = cleanString(body.streamUrl, 2000); const streamUrl = rawLink ? cleanHttpUrl(rawLink) : null;
  if (rawLink && (!streamUrl || !getVideoEmbed(streamUrl))) return NextResponse.json({ error: "That link is not supported. Paste a YouTube link (watch, youtu.be, /live/ or channel link) or a public Facebook video link." }, { status: 400 });
  const isLive = body.isLive === true;
  if (isLive && !streamUrl) return NextResponse.json({ error: "Paste your YouTube or Facebook live link before going live." }, { status: 400 });
  let scheduledFor: Date | null = null;
  if (typeof body.scheduledFor === "string" && body.scheduledFor.trim()) { scheduledFor = new Date(body.scheduledFor); if (Number.isNaN(scheduledFor.getTime())) return NextResponse.json({ error: "Invalid date." }, { status: 400 }); }
  try { const data = { title, description, streamUrl, scheduledFor, isLive }; const saved = await prisma.liveStream.upsert({ where: { id: ID }, create: { id: ID, ...data }, update: data }); revalidatePath("/", "layout"); revalidatePath("/live"); return NextResponse.json(saved); }
  catch (error) { console.error("[live] save failed:", error); return NextResponse.json({ error: "Could not save." }, { status: 500 }); }
}
