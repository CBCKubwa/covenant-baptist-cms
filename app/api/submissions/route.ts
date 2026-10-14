import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanString } from "@/lib/validation";
import { getClientIp, isLimited, limiterKey, recordHit } from "@/lib/rate-limit";

/** Public endpoint for Contact / Prayer-request form submissions. */
const ALLOWED_TYPES = ["CONTACT", "PRAYER"];
const MAX_PER_HOUR = 5; // submissions per visitor (IP) per hour
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Spam trap: the forms contain a hidden "website" field that humans never fill in.
  // Bots do, so we pretend it worked and quietly drop it.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const type = String(body.type || "").toUpperCase();
  const message = cleanString(body.message, 5000);
  if (!ALLOWED_TYPES.includes(type) || !message) {
    return NextResponse.json({ error: "Please write a message before sending." }, { status: 400 });
  }

  const email = cleanString(body.email, 200);
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  // Rate limit per visitor. Every attempt counts, so it also slows down flooding.
  const key = limiterKey("submit", getClientIp(request.headers));
  if (await isLimited(key, MAX_PER_HOUR)) {
    return NextResponse.json({ error: "You've sent several messages recently. Please try again in an hour." }, { status: 429 });
  }
  await recordHit(key, 60 * 60);

  try {
    await prisma.formSubmission.create({
      data: {
        type,
        name: cleanString(body.name, 120) ?? "Anonymous",
        email,
        phone: cleanString(body.phone, 40),
        message,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[submissions] save failed:", error);
    return NextResponse.json({ error: "We couldn't send that just now. Please try again." }, { status: 500 });
  }
}
