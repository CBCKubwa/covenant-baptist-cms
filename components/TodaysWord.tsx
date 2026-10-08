import { todaysWord, church } from "@/lib/content";

export default function TodaysWord() {
  const shareText = `\u201C${todaysWord.quote}\u201D \u2014 ${todaysWord.quoteBy}, ${church.name}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <section id="today" className="bg-white py-16 md:py-28">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-3.5">
            Today&rsquo;s Word
          </span>
          <h2 className="font-serif text-[clamp(1.9rem,4.2vw,2.9rem)] text-navy mt-3.5">What God Is Saying Today</h2>
          <p className="mt-3.5 text-[13px] text-ink-soft tracking-wide">{todaysWord.date}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="bg-parchment rounded-sm p-9">
            <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
              Quote of the Day
            </span>
            <blockquote className="relative m-0">
              <span className="absolute -left-1.5 top-4 font-serif text-[56px] leading-none text-gold/40 select-none">
                &ldquo;
              </span>
              <span className="relative block pl-1.5 font-serif text-[19px] leading-snug text-navy">
                {todaysWord.quote}
              </span>
            </blockquote>
            <cite className="block mt-4 not-italic text-[12.5px] text-ink-soft">&mdash; {todaysWord.quoteBy}</cite>
          </div>

          <div className="bg-parchment rounded-sm p-9">
            <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
              Question of the Day
            </span>
            <p className="text-[16.5px] leading-relaxed text-ink">{todaysWord.question}</p>
          </div>

          <div className="bg-parchment rounded-sm p-9">
            <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
              Prayer of the Day
            </span>
            <p className="text-[16.5px] leading-relaxed text-ink">{todaysWord.prayer}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-12">
          <a
            href="#today"
            className="inline-flex items-center px-7 py-3.5 rounded text-[13px] font-bold tracking-wide uppercase border border-navy/20 text-navy hover:border-navy hover:bg-navy/5 transition"
          >
            Read Today&rsquo;s Word
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded text-[12.5px] font-semibold border transition hover:-translate-y-0.5"
            style={{ color: "#2E7D5B", borderColor: "rgba(46,125,91,0.35)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.8 14.2c-.3.7-1.4 1.3-2 1.4-.5.1-1.2.2-3.6-.8-3-1.2-5-4.2-5.1-4.4-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.7 1.6.3.1.5.1.7-.1l.6-.7c.2-.3.4-.2.7-.1l1.7.8c.2.1.4.2.5.3.1.2.1.9-.2 1.6z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
