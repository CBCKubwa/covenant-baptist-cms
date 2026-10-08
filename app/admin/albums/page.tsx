import Link from "next/link";
import { Plus } from "lucide-react";
import { albums } from "@/lib/content";

export default function AdminAlbumsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-navy">Photos &amp; Albums</h1>
        <Link
          href="/admin/albums/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy text-parchment text-sm font-semibold hover:bg-midnight transition"
        >
          <Plus size={16} /> New Album
        </Link>
      </div>
      <div className="bg-white border border-navy/10 rounded-md overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-parchment/50 text-left text-ink-soft text-xs uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 font-semibold">Album</th>
              <th className="px-5 py-3 font-semibold hidden sm:table-cell">Date</th>
              <th className="px-5 py-3 font-semibold">Photos</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr key={album.slug} className="border-t border-navy/10">
                <td className="px-5 py-4 text-navy font-medium">{album.title}</td>
                <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{album.date}</td>
                <td className="px-5 py-4 text-ink-soft">{album.photos.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink-soft">
        One album, two real photos &mdash; both already live on the Media page. Once the database is connected, this
        list becomes fully editable and photo uploads go straight into an album.
      </p>
    </div>
  );
}
