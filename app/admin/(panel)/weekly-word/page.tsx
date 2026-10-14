import { prisma } from "@/lib/prisma";
import WeeklyWordForm from "@/components/admin/WeeklyWordForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { DbError } from "@/components/admin/AdminPageHeader";
import { currentWeekStart, formatWeekRange } from "@/lib/week";

export const dynamic = "force-dynamic";

/** Weekly Word: see what is live now, what is scheduled, and delete or replace entries. */
export default async function AdminWeeklyWordPage() {
  let words: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    words = await load();
  } catch (error) {
    console.error("[admin/weekly-word] load failed:", error);
    dbError = true;
  }

  const thisWeek = currentWeekStart();
  // The live entry is the most recent one that has started (same rule as the public site).
  const live = words.find((w) => w.date <= thisWeek);

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Weekly Word</h1>
      <p className="text-sm text-ink-soft mb-8 max-w-[60ch]">
        A quote, a question and a prayer, shown on the homepage for a whole week (Monday to Sunday). Schedule weeks in
        advance; if a week has no entry, the most recent one stays up.
      </p>
      {dbError && <DbError />}

      {live && (
        <div className="bg-white border border-navy/10 rounded-md p-6 mb-8 max-w-[560px]">
          <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3">Live now &mdash; week of {formatWeekRange(live.date)}</span>
          <p className="font-serif text-navy text-[15px] leading-relaxed mb-2">&ldquo;{live.quote}&rdquo;</p>
          {live.quoteBy && <p className="text-xs text-ink-soft">&mdash; {live.quoteBy}</p>}
        </div>
      )}

      <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3">Schedule a week</span>
      <WeeklyWordForm />

      {words.length > 0 && (
        <div className="mt-10 max-w-[560px]">
          <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3">All weeks</span>
          <div className="bg-white border border-navy/10 rounded-md divide-y divide-navy/10">
            {words.map((w) => (
              <div key={w.id} className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-navy">
                    {formatWeekRange(w.date)}
                    {w.id === live?.id && <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10.5px]">Live</span>}
                    {w.date > thisWeek && <span className="ml-2 px-2 py-0.5 rounded-full bg-gold/15 text-navy text-[10.5px]">Scheduled</span>}
                  </div>
                  <p className="mt-1 text-sm text-ink-soft line-clamp-2">{w.quote}</p>
                </div>
                <DeleteButton endpoint={`/api/admin/weekly-word/${w.id}`} itemName={`week of ${formatWeekRange(w.date)}`} warning="This weekly word will be removed." />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function load() {
  return prisma.weeklyWord.findMany({ orderBy: { date: "desc" }, take: 60 });
}
