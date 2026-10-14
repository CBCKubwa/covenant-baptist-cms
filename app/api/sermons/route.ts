import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public, read-only list of published sermons.
 * SECURITY FIX: this file used to also export an unauthenticated POST that let
 * anyone on the internet create sermons. Creating/deleting now lives only in
 * /api/admin/sermons, which requires an admin session.
 */
export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      where: { publishedAt: { not: null } },
      include: { speaker: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(sermons);
  } catch (error) {
    console.error("[sermons] fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch sermons." }, { status: 500 });
  }
}
