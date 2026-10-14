import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public, read-only list of published events.
 * SECURITY FIX: the old unauthenticated POST handler was removed (creating events
 * now requires an admin session via /api/admin/events).
 */
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { startsAt: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("[events] fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }
}
