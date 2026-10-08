import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { church, pageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | Covenant Baptist Church",
  description: "The story, vision, mission, and leadership of Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Our Story" title="About Covenant Baptist Church" description={pageContent.aboutIntro} />

      <section className="bg-parchment py-16 md:py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal className="grid gap-10 sm:grid-cols-2 pb-12 mb-12 border-b border-navy/10">
            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
                Our Vision
              </span>
              <blockquote className="font-serif italic text-[17px] leading-relaxed text-navy m-0">
                &ldquo;{church.visionFull}&rdquo;
                <cite className="block not-italic mt-3 text-[12px] text-ink-soft">{church.visionRef}</cite>
              </blockquote>
            </div>

            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
                Our Mission
              </span>
              <blockquote className="font-serif italic text-[17px] leading-relaxed text-navy m-0">
                &ldquo;{church.missionStatement}&rdquo;
                <cite className="block not-italic mt-3 text-[12px] text-ink-soft">{church.missionRef}</cite>
              </blockquote>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
              Leadership
            </span>
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border border-navy/10">
                <Image
                  src="/pastor.jpg"
                  alt="Rev'd Dr. Fajinmi Adetunji Matthew"
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                />
              </div>
              <div className="font-serif text-[19px] text-navy">Rev&rsquo;d Dr. Fajinmi Adetunji Matthew</div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
