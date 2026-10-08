import Image from "next/image";
import Reveal from "./Reveal";
import { pageContent } from "@/lib/content";

export default function Intro() {
  return (
    <section id="intro" className="bg-parchment py-16 md:py-28">
      <div className="max-w-[1180px] mx-auto px-6 grid gap-12 md:grid-cols-[1fr_0.82fr] md:gap-20 items-center">
        <Reveal>
          <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">Who We Are</span>
          <h2 className="font-serif text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.15] text-navy">
            A People Called
            <br />
            to Know Christ
          </h2>
          <p className="mt-6 text-[clamp(1rem,1.6vw,1.12rem)] leading-relaxed text-ink-soft max-w-[46ch]">
            {pageContent.homeIntro}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="relative aspect-[4/3] rounded-sm overflow-hidden">
          <Image
            src="/choir.jpg"
            alt="The Covenant Baptist Sanctuary Choir at Covenant Baptist Church"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover object-[center_28%]"
          />
        </Reveal>
      </div>
    </section>
  );
}
