import { pageMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MinistryAccordion from "@/components/MinistryAccordion";
import { ministries as sampleMinistries, type Ministry } from "@/lib/ministries";
import { getPublishedMinistries } from "@/lib/queries";
import { parseSections } from "@/lib/validation";

export const revalidate = 60;

/** Search-engine title/description: editable in Admin -> Search Appearance. */
export const generateMetadata = () => pageMetadata("/ministries");

export default async function MinistriesPage() {
  const rows = await getPublishedMinistries();

  // null = database unreachable -> built-in list. Otherwise the admin-managed list.
  const ministries: Ministry[] =
    rows === null
      ? sampleMinistries
      : rows.map((m) => ({
          slug: m.slug,
          name: m.name,
          blurb: m.blurb ?? "",
          image: m.image ?? undefined,
          sections: parseSections(m.sections),
        }));

  return (
    <>
      <PageHeader eyebrow="Get Involved" title="Ministries" description="Each ministry has its own heart for the church. Tap any one to read more." />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[820px] mx-auto">
          {ministries.length === 0 ? (
            <p className="text-ink-soft text-sm">Our ministries will be listed here soon.</p>
          ) : (
            <Reveal className="space-y-4">
              {ministries.map((m) => (
                <MinistryAccordion key={m.slug} ministry={m} />
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
