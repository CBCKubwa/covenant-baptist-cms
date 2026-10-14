import { FileAudio, FileVideo } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminPageHeader, { DbError } from "@/components/admin/AdminPageHeader";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

/** Standalone video & audio (worship recordings, highlight reels...) with delete. */
export default async function AdminVideoAudioPage() {
  let items: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    items = await load();
  } catch (error) {
    console.error("[admin/video-audio] load failed:", error);
    dbError = true;
  }

  return (
    <div>
      <AdminPageHeader
        title="Video & Audio"
        description="Standalone recordings. Sermon audio and video are managed from the Sermons section."
        actionHref="/admin/video-audio/new"
        actionLabel="New Upload"
      />
      {dbError && <DbError />}

      {items.length === 0 && !dbError ? (
        <div className="bg-white border border-dashed border-navy/20 rounded-md p-10 text-center">
          <p className="text-ink-soft text-sm">Nothing here yet. Click &ldquo;New Upload&rdquo; to add a video or audio recording.</p>
        </div>
      ) : (
        <div className="bg-white border border-navy/10 rounded-md overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-parchment/50 text-left text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">Added</th>
                <th className="px-5 py-3 w-14"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-navy/10">
                  <td className="px-5 py-4">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-navy font-medium hover:underline">{item.title}</a>
                    {item.description && <div className="text-xs text-ink-soft line-clamp-1">{item.description}</div>}
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      {item.type === "AUDIO" ? <FileAudio size={15} className="text-gold" /> : <FileVideo size={15} className="text-gold" />}
                      {item.type === "AUDIO" ? "Audio" : "Video"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{item.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-3 py-3 text-right">
                    <DeleteButton endpoint={`/api/admin/media/${item.id}`} itemName={item.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function load() {
  return prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" } });
}
