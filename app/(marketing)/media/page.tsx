import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MediaTabs, { type AlbumView, type MediaView } from "@/components/MediaTabs";
import { albums as sampleAlbums } from "@/lib/content";
import { getMediaItems, getPublishedAlbums } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Media | Covenant Baptist Church",
  description: "Photos, videos, and audio from Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default async function MediaPage() {
  const [dbAlbums, dbMedia] = await Promise.all([getPublishedAlbums(), getMediaItems()]);

  // Database unreachable -> fall back to the sample album bundled with the site.
  const albums: AlbumView[] =
    dbAlbums === null
      ? sampleAlbums.map((a) => ({ id: a.slug, title: a.title, dateLabel: a.date, photos: a.photos }))
      : dbAlbums
          .filter((a) => a.photos.length > 0) // hide empty albums from visitors
          .map((a) => ({
            id: a.id,
            title: a.title,
            dateLabel: a.date?.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) ?? "",
            photos: a.photos.map((p) => ({ src: p.url, alt: p.caption || a.title, caption: p.caption || a.title })),
          }));

  const toView = (type: "VIDEO" | "AUDIO"): MediaView[] =>
    (dbMedia ?? [])
      .filter((m) => m.type === type)
      .map((m) => ({ id: m.id, title: m.title, url: m.url, description: m.description }));

  return (
    <>
      <PageHeader eyebrow="Media" title="Photos, Videos & Audio" description="A growing archive of church life." />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <Reveal>
            <MediaTabs albums={albums} videos={toView("VIDEO")} audios={toView("AUDIO")} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
