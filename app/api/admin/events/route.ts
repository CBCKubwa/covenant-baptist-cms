import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
export async function GET() { return NextResponse.json(await prisma.event.findMany({ orderBy: { startsAt: "asc" } })); }
export async function POST(request: Request) {
  const b = await request.json(); const base = slugify(b.title); const slug = `${base}-${Date.now()}`;
  const event = await prisma.event.create({ data: { title:b.title, slug, startsAt:new Date(b.startsAt || b.date), endsAt:b.endsAt ? new Date(b.endsAt) : null, startTime:b.time || b.startTime, endTime:b.endTime, location:b.location, description:b.description, registrationUrl:b.registrationUrl, department:b.department, category:b.category, status:b.status || "PUBLISHED" } });
  return NextResponse.json(event, { status:201 });
}
