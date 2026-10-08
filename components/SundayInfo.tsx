import Link from "next/link";
import { church } from "@/lib/content";

export default function SundayInfo() {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

  return (
    <section className="bg-navy text-parchment py-14 md:py-16 px-6">
      <div className="max-w-[1180px] mx-auto grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold-light mb-3">
            Sunday at Covenant
          </span>
          <p className="text-[15px] text-parchment/80 leading-relaxed max-w-[54ch]">
            {church.address}. Service times are being finalized for the new site &mdash; message us on WhatsApp and
            we&rsquo;ll let you know exactly when to come.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/visit"
            className="inline-flex items-center px-6 py-3 rounded bg-gold text-navy text-xs font-bold tracking-wide uppercase hover:bg-gold-light transition"
          >
            Plan Your Visit
          </Link>
          <a
            href={mapHref}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center px-6 py-3 rounded border border-parchment/30 text-parchment text-xs font-bold tracking-wide uppercase hover:border-gold hover:text-gold-light transition"
          >
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
