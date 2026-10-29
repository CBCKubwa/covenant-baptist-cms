import { prisma } from "@/lib/prisma";
import AdminPageHeader, { DbError } from "@/components/admin/AdminPageHeader";
import DeleteButton from "@/components/admin/DeleteButton";
import ShareButton from "@/components/ShareButton";

export const dynamic = "force-dynamic";

/** Sermon list with delete. Server component: reads the database directly. */
export default async function SermonsAdminPage() {
  let sermons: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    sermons = await load();
  } catch (error) {
    console.error("[admin/sermons] load failed:", error);
    dbError = true;
  }

  return (
    <div>
      <AdminPageHeader
        title="Sermons"
        description="Upload and manage Sunday messages. Deleting a sermon also removes its uploaded audio and video."
        actionHref="/admin/sermons/new"
        actionLabel="New Sermon"
      />
      {dbError && <DbError />}

      <div className="bg-white border border-navy/10 rounded-md overflow-hidden overflow-x-auto">
        {sermons.length === 0 && !dbError ? (
          <p className="p-10 text-center text-sm text-ink-soft">No sermons yet. Click &ldquo;New Sermon&rdquo; to add the first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-parchment/50 text-left text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Speaker</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 font-semibold">Media</th>
                <th className="px-5 py-3 w-40"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {sermons.map((s) => (
                <tr key={s.id} className="border-t border-navy/10">
                  <td className="px-5 py-4">
                    <div className="text-navy font-medium">{s.title}</div>
                    <div className="text-xs text-ink-soft">{s.scripture}</div>
                  </td>
                  <td className="px-5 py-4 text-ink-soft hidden md:table-cell">{s.speaker.name}</td>
                  <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{s.date ? s.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {s.audioUrl && <Badge>Audio</Badge>}
                      {s.videoUrl && <Badge>Video</Badge>}
                      {s.youtubeUrl && <Badge>YouTube</Badge>}
                      {!s.audioUrl && !s.videoUrl && !s.youtubeUrl && <span className="text-xs text-ink-soft/60">None</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2"><ShareButton url={`/teachings/${s.slug}`} title={s.title} message={`${s.speaker.name} · ${s.scripture}`} size="sm" /><div className="flex items-center justify-end gap-2"><ShareButton url={`/teachings/${s.slug}`} title={s.title} message={`${s.speaker.name} · ${s.scripture}`} size="sm" /><DeleteButton endpoint={`/api/admin/sermons/${s.id}`} itemName={s.title} /></div></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function load() {
  return prisma.sermon.findMany({ include: { speaker: true }, orderBy: { date: "desc" } });
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-full bg-gold/15 text-[11px] font-semibold text-navy">{children}</span>;
}
