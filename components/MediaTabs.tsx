"use client";

import { useState } from "react";
import PhotoGrid from "./PhotoGrid";
import { getYouTubeEmbedUrl } from "@/lib/media";

export type AlbumView = {
  id: string;
  title: string;
  dateLabel: string;
  photos: { src: string; alt: string; caption: string }[];
};
export type MediaView = { id: string; title: string; url: string; description: string | null };

const TABS = ["Photos", "Videos", "Audio"] as const;
type Tab = (typeof TABS)[number];

function EmptyTab({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-navy/20 rounded-md py-16 flex items-center justify-center text-center px-6">
      <p className="text-ink-soft text-sm max-w-[36ch]">{message}</p>
    </div>
  );
}

/** Photos / Videos / Audio tabs. Data is loaded on the server (app/(marketing)/media/page.tsx). */
export default function MediaTabs({ albums, videos, audios }: { albums: AlbumView[]; videos: MediaView[]; audios: MediaView[] }) {
  const [tab, setTab] = useState<Tab>("Photos");

  return (
    <div>
      <div className="flex gap-2 mb-10 border-b border-navy/10" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === t ? "border-gold text-navy" : "border-transparent text-ink-soft hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Photos" &&
        (albums.length === 0 ? (
          <EmptyTab message="No photo albums yet. Please check back soon." />
        ) : (
          <div className="space-y-14">
            {albums.map((album) => (
              <div key={album.id}>
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="font-serif text-lg text-navy">{album.title}</h3>
                  {album.dateLabel && <span className="text-xs text-ink-soft">{album.dateLabel}</span>}
                </div>
                <PhotoGrid photos={album.photos} />
              </div>
            ))}
          </div>
        ))}

      {tab === "Videos" &&
        (videos.length === 0 ? (
          <EmptyTab message="No standalone videos yet. Sermon videos are in the Teachings library." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {videos.map((v) => {
              const embed = getYouTubeEmbedUrl(v.url);
              return (
                <figure key={v.id}>
                  {embed ? (
                    <iframe src={embed} title={v.title} loading="lazy" allowFullScreen className="w-full aspect-video rounded-sm" />
                  ) : (
                    <video controls preload="metadata" src={v.url} className="w-full aspect-video rounded-sm bg-black" />
                  )}
                  <figcaption className="mt-2.5">
                    <div className="font-serif text-navy">{v.title}</div>
                    {v.description && <p className="text-[13px] text-ink-soft mt-0.5">{v.description}</p>}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ))}

      {tab === "Audio" &&
        (audios.length === 0 ? (
          <EmptyTab message="No standalone audio yet. Sermon audio is in the Teachings library." />
        ) : (
          <div className="grid gap-4 max-w-[640px]">
            {audios.map((a) => (
              <div key={a.id} className="border border-navy/10 rounded-sm p-4">
                <div className="font-serif text-navy">{a.title}</div>
                {a.description && <p className="text-[13px] text-ink-soft mt-0.5">{a.description}</p>}
                <audio controls preload="none" src={a.url} className="w-full mt-3" aria-label={`Audio: ${a.title}`} />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
