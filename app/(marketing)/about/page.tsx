import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { church, pageContent } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";
import { resolveIdentity, resolvePastor } from "@/lib/site-content";

export const revalidate = 60;

/** Search-engine title/description: editable in Admin -> Search Appearance. */
export const generateMetadata = () => pageMetadata("/about");

export default async function AboutPage() {
  // Intro, vision and mission text can be edited in Admin -> Pages; blank = built-in wording.
  const settings = await getSiteSettings();
  const vision = settings?.visionFull || church.visionFull;
  const mission = settings?.missionStatement || church.missionStatement;
  const pastor = resolvePastor(settings); // name, title and photo editable in Admin -> Pages
  return (
    <>
      <PageHeader eyebrow="Our Story" title={`About ${resolveIdentity(settings).name}`} description={settings?.aboutIntro || pageContent.aboutIntro} />

      <section className="bg-parchment py-16 md:py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal className="grid gap-10 sm:grid-cols-2 pb-12 mb-12 border-b border-navy/10">
            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
                Our Vision
              </span>
              <blockquote className="font-serif italic text-[17px] leading-relaxed text-navy m-0">
                &ldquo;{vision}&rdquo;
                {/* The verse reference only belongs with the built-in verse, not with custom text. */}
                {!settings?.visionFull && <cite className="block not-italic mt-3 text-[12px] text-ink-soft">{church.visionRef}</cite>}
              </blockquote>
            </div>

            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
                Our Mission
              </span>
              <blockquote className="font-serif italic text-[17px] leading-relaxed text-navy m-0">
                &ldquo;{mission}&rdquo;
                {!settings?.missionStatement && <cite className="block not-italic mt-3 text-[12px] text-ink-soft">{church.missionRef}</cite>}
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
                  src={pastor.photo}
                  alt={pastor.name}
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <div className="font-serif text-[19px] text-navy">{pastor.name}</div>
                {pastor.title && <div className="mt-0.5 text-sm text-ink-soft">{pastor.title}</div>}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
