/**
 * Week helpers for the Weekly Word.
 *
 * A "week" runs Monday -> Sunday. We identify a week by its Monday at 00:00 UTC
 * (stored in the database). The site flips to the new week at Monday 00:00
 * Nigerian time (WAT = UTC+1), which is what `currentWeekStart` accounts for.
 */
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WAT_OFFSET = HOUR;

/** Monday 00:00 UTC of the week that contains `date` (calendar date taken in UTC). */
export function startOfWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const sinceMonday = (d.getUTCDay() + 6) % 7; // Mon=0 ... Sun=6
  return new Date(d.getTime() - sinceMonday * DAY);
}

/** The week that is "live" right now, in Nigerian time. */
export function currentWeekStart(now: Date = new Date()): Date {
  return startOfWeek(new Date(now.getTime() + WAT_OFFSET));
}

/** "12 – 18 October 2026" (handles weeks that span two months or two years). */
export function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart.getTime() + 6 * DAY);
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString("en-GB", { timeZone: "UTC", ...opts });

  const sameMonth = weekStart.getUTCMonth() === end.getUTCMonth() && weekStart.getUTCFullYear() === end.getUTCFullYear();
  if (sameMonth) return `${fmt(weekStart, { day: "numeric" })} – ${fmt(end, { day: "numeric", month: "long", year: "numeric" })}`;
  if (weekStart.getUTCFullYear() === end.getUTCFullYear())
    return `${fmt(weekStart, { day: "numeric", month: "long" })} – ${fmt(end, { day: "numeric", month: "long", year: "numeric" })}`;
  return `${fmt(weekStart, { day: "numeric", month: "long", year: "numeric" })} – ${fmt(end, { day: "numeric", month: "long", year: "numeric" })}`;
}
