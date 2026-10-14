import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";
import { cleanString, cleanUploadedUrl } from "@/lib/validation";

/** Plain-text settings an admin may edit. Anything else in the request is ignored. */
const TEXT_FIELDS = [
  "churchName", "address", "googleMapsUrl", "phone", "whatsapp", "email", "website",
  "facebook", "instagram", "youtube", "visionShort", "visionFull", "missionStatement",
  "description", "whoWeAre", "ourStory", "history", "coreValues", "statementOfFaith",
  "officeHours", "homeIntro", "aboutIntro", "visitWhatToExpect", "serviceTimes", "heroTitle", "heroSubtitle", "heroImageUrl", "welcomeMessage",
] as const;

export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!(await getAdminSession())) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data: Record<string, string | null> = {};
  for (const key of TEXT_FIELDS) {
    if (key in body) data[key] = cleanString(body[key]);
  }

  // Logo: a new URL replaces it, null / "" resets to the bundled default.
  let oldLogo: string | null = null;
  if ("logoUrl" in body) {
    const newLogo = cleanUploadedUrl(body.logoUrl);
    if (body.logoUrl && !newLogo) {
      return NextResponse.json({ error: "Invalid logo URL." }, { status: 400 });
    }
    const current = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    oldLogo = current?.logoUrl && current.logoUrl !== newLogo ? current.logoUrl : null;
    data.logoUrl = newLogo;
  }

  try {
    const saved = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    // Free storage: remove the logo that was just replaced.
    await deleteBlobs([oldLogo]);

    revalidatePath("/", "layout"); // header + footer on every page show the logo
    return NextResponse.json(saved);
  } catch (error) {
    console.error("[settings] save failed:", error);
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}
