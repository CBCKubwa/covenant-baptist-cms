import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() { return NextResponse.json(await prisma.siteSettings.upsert({ where: { id: "singleton" }, update: {}, create: {} })); }
export async function PUT(request: Request) {
  const body = await request.json();
  const allowed = ["churchName","address","googleMapsUrl","phone","whatsapp","email","website","facebook","instagram","youtube","visionShort","visionFull","missionStatement","description","whoWeAre","ourStory","history","coreValues","statementOfFaith","officeHours","heroTitle","heroSubtitle","heroImageUrl","welcomeMessage"];
  const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  return NextResponse.json(await prisma.siteSettings.upsert({ where: { id: "singleton" }, update: data, create: { id: "singleton", ...data } }));
}
