import { NextResponse } from "next/server";
import { getLiveStream } from "@/lib/queries";
export const dynamic = "force-dynamic";
export async function GET() {
  const live = await getLiveStream();
  return NextResponse.json({ isLive: !!live?.isLive, version: live ? String(live.updatedAt.getTime()) : "0" }, { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } });
}
