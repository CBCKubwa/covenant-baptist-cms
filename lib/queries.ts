import "server-only";
import { prisma } from "@/lib/prisma";
import { currentWeekStart } from "@/lib/week";

/**
 * Read queries for the PUBLIC website.
 *
 * Contract: each function returns `null` when the database cannot be reached
 * (the page then shows built-in sample content from lib/content.ts) and an
 * array - possibly empty - when it can. That way an admin who deletes every
 * sermon sees an empty list, not stale sample data.
 */
async function safe<T>(label: string, run: () => Promise<T>): Promise<T | null> {
  try {
    return await run();
  } catch (error) {
    console.error(`[queries] ${label} failed:`, error);
    return null;
  }
}

export function getPublishedSermons(limit?: number) {
  return safe("sermons", () =>
    prisma.sermon.findMany({
      where: { publishedAt: { not: null } },
      include: { speaker: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: limit,
    })
  );
}

export function getPublishedAlbums() {
  return safe("albums", () =>
    prisma.album.findMany({
      where: { status: "PUBLISHED" },
      include: { photos: { orderBy: { order: "asc" } } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    })
  );
}

export function getSermonBySlug(slug: string) {
  return safe("sermon", () =>
    prisma.sermon.findFirst({ where: { slug, publishedAt: { not: null } }, include: { speaker: true } })
  );
}

export function getMediaItemById(id: string) {
  return safe("media item", () => prisma.mediaItem.findUnique({ where: { id } }));
}

/** Current live-stream record; null is treated as offline. */
export function getLiveStream() {
  return safe("live stream", () => prisma.liveStream.findUnique({ where: { id: "singleton" } }));
}

export function getMediaItems() {
  return safe("media", () => prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" } }));
}

// ---------------------------------------------------------------------------
// Weekly Word, events, articles, ministries
// ---------------------------------------------------------------------------

/**
 * The Weekly Word for the current week: the most recent entry whose week has
 * started. (If the admin skips a week, last week's stays up rather than going blank.)
 * `ok: false` = database unreachable; `word: null` = nothing scheduled yet.
 */
export async function getCurrentWeeklyWord() {
  try {
    const word = await prisma.weeklyWord.findFirst({
      where: { date: { lte: currentWeekStart() } },
      orderBy: { date: "desc" },
    });
    return { ok: true as const, word };
  } catch (error) {
    console.error("[queries] weekly word failed:", error);
    return { ok: false as const, word: null };
  }
}

/** Published events from today onward, soonest first. */
export function getUpcomingEvents() {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  return safe("events", () =>
    prisma.event.findMany({
      where: { status: "PUBLISHED", startsAt: { gte: startOfToday } },
      orderBy: { startsAt: "asc" },
    })
  );
}

export function getPublishedArticles() {
  return safe("articles", () =>
    prisma.article.findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    })
  );
}

export function getArticleBySlug(slug: string) {
  return safe("article", () => prisma.article.findFirst({ where: { slug, publishedAt: { not: null } } }));
}

export function getPublishedMinistries() {
  return safe("ministries", () =>
    prisma.ministry.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    })
  );
}
