import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";
import { cleanHttpUrl, cleanString, cleanUploadedUrl } from "@/lib/validation";
import { parseNavLabels, parseSeo, withRequiredDefaults } from "@/lib/site-content";

/** Settings that hold an uploaded picture. Replacing one deletes the old file from storage. */
const IMAGE_FIELDS = ["logoUrl", "visitImageUrl", "heroImageUrl", "pastorPhotoUrl", "faviconUrl"] as const;

/** Settings that must be web links. */
const URL_FIELDS = ["googleMapsUrl", "website", "facebook", "instagram", "youtube"] as const;

/** Plain-text settings an admin may edit. Anything else in the request is ignored. */
const TEXT_FIELDS = [
  "churchName", "churchLocation", "address", "phone", "whatsapp", "email", "visionShort", "visionFull", "missionStatement",
  "description", "whoWeAre", "ourStory", "history", "coreValues", "statementOfFaith",
  "officeHours", "homeIntro", "aboutIntro", "visitWhatToExpect", "serviceTimes",
  "heroTitle", "heroTagline", "heroSubtitle", "heroPrimaryLabel", "heroSecondaryLabel",
  "pastorName", "pastorTitle", "copyrightText", "welcomeMessage",
] as const;

/** Maximum length per text field (anything not listed may be up to 5000 characters). */
const TEXT_LIMITS: Record<string, number> = {
  heroTitle: 120, heroTagline: 80, heroSubtitle: 300, heroPrimaryLabel: 30, heroSecondaryLabel: 30,
  pastorName: 120, pastorTitle: 120, copyrightText: 200,
  address: 300, phone: 40, whatsapp: 40, email: 200, churchName: 120, churchLocation: 80,
};

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

  // ---- 1. Validate everything BEFORE touching the database --------------------------------

  const data: Record<string, string | null> = {};
  for (const key of TEXT_FIELDS) {
    if (key in body) data[key] = cleanString(body[key], TEXT_LIMITS[key] ?? 5000);
  }

  // Links must be real http(s) addresses (they become clickable on the public site).
  for (const key of URL_FIELDS) {
    if (!(key in body)) continue;
    const url = cleanHttpUrl(body[key]);
    if (body[key] && String(body[key]).trim() && !url) {
      return NextResponse.json({ error: `Please enter a full web address starting with https:// (check "${key}").` }, { status: 400 });
    }
    data[key] = url;
  }

  if (typeof data.email === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  // Images: only files from our own storage (or bundled /public files) are accepted.
  const touched = IMAGE_FIELDS.filter((field) => field in body);
  const nextUrls: Partial<Record<(typeof IMAGE_FIELDS)[number], string | null>> = {};
  for (const field of touched) {
    const next = cleanUploadedUrl(body[field]);
    if (body[field] && !next) {
      return NextResponse.json({ error: "Invalid image URL." }, { status: 400 });
    }
    nextUrls[field] = next;
  }

  // Menu labels: an object keyed by link. An empty result clears every override.
  let navLabels: Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined;
  if ("navLabels" in body) {
    const parsed = parseNavLabels(body.navLabels);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    navLabels = Object.keys(parsed.labels).length > 0 ? parsed.labels : Prisma.JsonNull;
  }

  // Search-engine titles/descriptions per page. An empty result clears every override.
  let seo: Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined;
  if ("seo" in body) {
    const parsed = parseSeo(body.seo);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    seo = Object.keys(parsed.seo).length > 0 ? parsed.seo : Prisma.JsonNull;
  }

  // ---- 2. Save ---------------------------------------------------------------------------

  // Pictures that get replaced are collected so they can be removed from storage afterwards.
  const replacedFiles: Array<string | null> = [];

  try {
    if (touched.length > 0) {
      const current = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
      for (const field of touched) {
        const old = current?.[field] ?? null;
        if (old && old !== nextUrls[field]) replacedFiles.push(old);
        data[field] = nextUrls[field] ?? null;
      }
    }

    // A blank church name falls back to the built-in name (the database column is required).
    const fields = { ...withRequiredDefaults(data), ...(navLabels !== undefined ? { navLabels } : {}), ...(seo !== undefined ? { seo } : {}) };
    const saved = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: fields,
      create: { id: "singleton", ...fields },
    });

    // Free storage: remove any picture that was just replaced.
    await deleteBlobs(replacedFiles);

    revalidatePath("/", "layout"); // header, footer, banner and tab icon appear on every page
    return NextResponse.json(saved);
  } catch (error) {
    console.error("[settings] save failed:", error);
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}
