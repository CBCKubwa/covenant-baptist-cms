import Link from "next/link";
import { getSiteSettings, resolveContact } from "@/lib/settings";

/**
 * Homepage "Sunday at Covenant" strip. Address, map link and service times all come
 * from the admin (Church Info & Pages) and fall back to the built-in wording.
 */
export default async function SundayInfo() {
  const settings = await getSiteSettings();
  const { address, mapsUrl: mapHref } = resolveContact(settings);
  const serviceTimes = settings?.serviceTimes;

  return (
    <section className="bg-navy text-parchment py-14 md:py-16 px-6">
      <div className="max-w-[1180px] mx-auto grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold-light mb-3">
            Sunday at Covenant
          </span>
          {serviceTimes ? (
            <>
              <p className="text-[15px] text-parchment leading-relaxed max-w-[54ch] whitespace-pre-line">{serviceTimes}</p>
              <p className="mt-3 text-[14px] text-parchment/70 max-w-[54ch]">{address}</p>
            </>
          ) : (
            <p className="text-[15px] text-parchment/80 leading-relaxed max-w-[54ch]">
              {address}. Service times are being finalized for the new site &mdash; message us on WhatsApp and
              we&rsquo;ll let you know exactly when to come.
            </p>
          )}
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
