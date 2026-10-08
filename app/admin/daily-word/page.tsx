import { todaysWord } from "@/lib/content";
import DailyWordForm from "@/components/admin/DailyWordForm";

export default function AdminDailyWordPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Daily Word</h1>
      <p className="text-sm text-ink-soft mb-8">Today&rsquo;s quote, question, and prayer &mdash; shown on the homepage.</p>

      <div className="bg-white border border-navy/10 rounded-md p-6 mb-8 max-w-[560px]">
        <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3">
          Currently Live &mdash; {todaysWord.date}
        </span>
        <p className="font-serif text-navy text-[15px] leading-relaxed mb-2">&ldquo;{todaysWord.quote}&rdquo;</p>
        <p className="text-xs text-ink-soft">&mdash; {todaysWord.quoteBy}</p>
      </div>

      <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3">
        Schedule a New One
      </span>
      <DailyWordForm />
    </div>
  );
}
