import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_FIELDS = [
  "churchName",
  "logoUrl",
  "address",
  "googleMapsUrl",
  "phone",
  "whatsapp",
  "email",
  "website",
  "facebook",
  "instagram",
  "youtube",
  "visionShort",
  "visionFull",
  "missionStatement",
  "description",
  "whoWeAre",
  "ourStory",
  "history",
  "coreValues",
  "statementOfFaith",
  "officeHours",
  "heroTitle",
  "heroSubtitle",
  "heroImageUrl",
  "welcomeMessage",
];

// GET /api/settings - Retrieve site settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton", logoUrl: "/cbc-logo.png" },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}

// Internal update logic for PUT/POST
async function handleUpdate(request: Request) {
  try {
    const body = await request.json();
    const data = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key))
    );

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return handleUpdate(request);
}

export async function POST(request: Request) {
  return handleUpdate(request);
}