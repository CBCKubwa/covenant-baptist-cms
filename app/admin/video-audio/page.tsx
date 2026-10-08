import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminVideoAudioPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-navy">Video &amp; Audio</h1>
        <Link
          href="/admin/video-audio/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy text-parchment text-sm font-semibold hover:bg-midnight transition"
        >
          <Plus size={16} /> New Upload
        </Link>
      </div>
      <div className="bg-white border border-dashed border-navy/20 rounded-md p-10 text-center">
        <p className="text-ink-soft text-sm">
          Nothing here yet. Sermon audio and video already have a home in the Sermons form &mdash; this section is
          for anything standalone, like worship recordings or event highlight reels.
        </p>
      </div>
    </div>
  );
}
