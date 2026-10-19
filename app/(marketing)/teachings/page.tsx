import { pageMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SermonCard from "@/components/SermonCard";
import { featuredSermon } from "@/lib/content";
import { getPublishedSermons } from "@/lib/queries";

export const revalidate = 60;

/** Search-engine title/description: editable in Admin -> Search Appearance. */
export const generateMetadata = () => pageMetadata("/teachings");

export default async function TeachingsPage() {
  // null = database unreachable -> show the built-in sample sermon instead of an error.
  const sermons = await getPublishedSermons();

  return (
    <>
      <PageHeader
        eyebrow="Teachings"
        title="Sermon Library"
        description="Every message, with audio and video to listen to or watch again."
      />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          {sermons === null ? (
            <Reveal className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[880px]">
              <SermonCard title={featuredSermon.title} speaker={featuredSermon.speaker} scripture={featuredSermon.scripture} />
            </Reveal>
          ) : sermons.length === 0 ? (
            <p className="text-ink-soft text-sm">No sermons have been published yet. Please check back soon.</p>
          ) : (
            <Reveal className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((s) => (
                <SermonCard
                  key={s.id}
                  title={s.title}
                  speaker={s.speaker.name}
                  scripture={s.scripture}
                  dateLabel={s.date?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  audioUrl={s.audioUrl}
                  videoUrl={s.videoUrl}
                  youtubeUrl={s.youtubeUrl}
                />
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
