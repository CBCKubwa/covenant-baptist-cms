import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { church, pageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Plan Your Visit | Covenant Baptist Church",
  description: "Everything you need to know before visiting Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function VisitPage() {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

  return (
    <>
      <PageHeader
        eyebrow="Plan Your Visit"
        title="We Look Forward to Welcoming You"
        description="Here's everything you need to know before you come."
      />
      <section className="bg-parchment py-16 md:py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal className="relative aspect-[16/9] rounded-sm overflow-hidden mb-12">
            <Image
              src="/church-building.jpg"
              alt="Covenant Baptist Church building, Byazhin-Kubwa, Abuja"
              fill
              sizes="(min-width: 900px) 900px, 100vw"
              className="object-cover object-[78%_35%]"
            />
          </Reveal>

          <Reveal className="grid sm:grid-cols-2 gap-x-10 gap-y-8 pb-12 mb-12 border-b border-navy/10">
            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-3">
                Service Times
              </span>
              <p className="text-[14px] leading-relaxed text-ink-soft">
                We&rsquo;re finalizing service times for the new site &mdash; message us on WhatsApp and we&rsquo;ll
                let you know exactly when to come.
              </p>
            </div>
            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-3">
                First Time Here?
              </span>
              <p className="text-[14px] leading-relaxed text-ink-soft">{pageContent.visitWhatToExpect}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
              Location &amp; Directions
            </span>
            <p className="text-[15px] leading-relaxed text-ink mb-6">{church.address}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={mapHref}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center px-6 py-3 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
              >
                Get Directions
              </a>
              <a
                href={`https://wa.me/${church.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center px-6 py-3 rounded border border-navy/20 text-navy text-xs font-bold tracking-wide uppercase hover:border-navy transition"
              >
                Message Us on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
