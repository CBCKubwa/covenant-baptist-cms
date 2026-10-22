import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { pageContent } from "@/lib/content";
import { getSiteSettings, resolveContact } from "@/lib/settings";
import { resolveIdentity } from "@/lib/site-content";

export const revalidate = 60;

/** Search-engine title/description: editable in Admin -> Search Appearance. */
export const generateMetadata = () => pageMetadata("/visit");

export default async function VisitPage() {
  // Address, service times and the welcome text come from Admin -> Church Info / Pages when set.
  const settings = await getSiteSettings();
  const { address, whatsappUrl, mapsUrl: mapHref } = resolveContact(settings);
  const identity = resolveIdentity(settings);

  // Admin-uploaded photo, or the bundled church-building photo. The bundled one is
  // cropped toward the building's sign; uploaded photos are simply centred.
  const customImage = settings?.visitImageUrl;

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
              src={customImage || "/church-building.jpg"}
              alt={customImage ? identity.name : `${identity.name} building, ${identity.location}`}
              fill
              sizes="(min-width: 900px) 900px, 100vw"
              className={customImage ? "object-cover" : "object-cover object-[78%_35%]"}
            />
          </Reveal>

          <Reveal className="grid sm:grid-cols-2 gap-x-10 gap-y-8 pb-12 mb-12 border-b border-navy/10">
            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-3">
                Service Times
              </span>
              {settings?.serviceTimes ? (
                <p className="text-[14px] leading-relaxed text-ink whitespace-pre-line">{settings.serviceTimes}</p>
              ) : (
                <p className="text-[14px] leading-relaxed text-ink-soft">
                  We&rsquo;re finalizing service times for the new site &mdash; message us on WhatsApp and we&rsquo;ll
                  let you know exactly when to come.
                </p>
              )}
            </div>
            <div>
              <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-3">
                First Time Here?
              </span>
              <p className="text-[14px] leading-relaxed text-ink-soft">{settings?.visitWhatToExpect || pageContent.visitWhatToExpect}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
              Location &amp; Directions
            </span>
            <p className="text-[15px] leading-relaxed text-ink mb-6">{address}</p>
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
                href={whatsappUrl}
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
