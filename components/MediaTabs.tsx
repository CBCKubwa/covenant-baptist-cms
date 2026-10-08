"use client";

import { useState } from "react";
import Link from "next/link";
import PhotoGrid from "./PhotoGrid";
import { albums } from "@/lib/content";

const TABS = ["Photos", "Videos", "Audio"] as const;
type Tab = (typeof TABS)[number];

function EmptyTab({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-navy/20 rounded-md py-16 flex flex-col items-center justify-center text-center px-6">
      <p className="text-ink-soft text-sm max-w-[36ch] mb-4">{message}</p>
      <Link href="/teachings" className="text-[13px] text-navy underline underline-offset-2">
        Go to Teachings
      </Link>
    </div>
  );
}

export default function MediaTabs() {
  const [tab, setTab] = useState<Tab>("Photos");

  return (
    <div>
      <div className="flex gap-2 mb-10 border-b border-navy/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === t ? "border-gold text-navy" : "border-transparent text-ink-soft hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Photos" && (
        <div className="space-y-14">
          {albums.length === 0 ? (
            <p className="text-ink-soft text-sm">No albums yet. Add one from the admin.</p>
          ) : (
            albums.map((album) => (
              <div key={album.slug}>
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="font-serif text-lg text-navy">{album.title}</h3>
                  {album.date && <span className="text-xs text-ink-soft">{album.date}</span>}
                </div>
                <PhotoGrid photos={album.photos} />
              </div>
            ))
          )}
        </div>
      )}
      {tab === "Videos" && (
        <EmptyTab message="No standalone videos yet. Sermon videos will appear in the Teachings library once added." />
      )}
      {tab === "Audio" && <EmptyTab message="No standalone audio yet. Sermon audio lives in the Teachings library." />}
    </div>
  );
}
