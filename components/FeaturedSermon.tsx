import Link from "next/link";
import Image from "next/image";
import AudioPlayer from "./AudioPlayer";
import { featuredSermon } from "@/lib/content";

export default function FeaturedSermon() {
  return (
    <section id="sermon" className="bg-midnight text-parchment py-16 md:py-28 relative overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 grid gap-14 md:grid-cols-[1fr_0.95fr] md:items-center">
        <div>
          <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold-light mb-4">
            Featured Sermon
          </span>
          <h2 className="font-serif text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[1.1] text-white mt-4">
            Divine Mandate
            <br />
            for Harvest
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-parchment/70">
            <strong className="text-gold-light font-semibold">{featuredSermon.scripture}</strong>
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-parchment/15">
              <Image src="/pastor.jpg" alt="" fill sizes="36px" className="object-cover object-top" />
            </div>
            <span className="text-sm text-parchment/80">{featuredSermon.speaker}</span>
          </div>
          <Link
            href="/teachings"
            className="inline-block mt-8 text-[12.5px] text-gold-light border-b border-gold/50 hover:border-gold pb-0.5 transition"
          >
            View all sermons &rarr;
          </Link>
        </div>

        <AudioPlayer src={featuredSermon.audioUrl} title={featuredSermon.title} />
      </div>
    </section>
  );
}
