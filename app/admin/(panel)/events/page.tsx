import { prisma } from "@/lib/prisma";
import AdminPageHeader, { DbError } from "@/components/admin/AdminPageHeader";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

/** Event list with delete. (Now reads the database directly and uses the admin theme.) */
export default async function EventsAdminPage() {
  let events: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    events = await load();
  } catch (error) {
    console.error("[admin/events] load failed:", error);
    dbError = true;
  }

  return (
    <div>
      <AdminPageHeader
        title="Events"
        description="Create and schedule upcoming church programs."
        actionHref="/admin/events/new"
        actionLabel="New Event"
      />
      {dbError && <DbError />}

      <div className="bg-white border border-navy/10 rounded-md overflow-hidden overflow-x-auto">
        {events.length === 0 && !dbError ? (
          <p className="p-10 text-center text-sm text-ink-soft">No events yet. Click &ldquo;New Event&rdquo; to add one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-parchment/50 text-left text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Location</th>
                <th className="px-5 py-3 w-14"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-navy/10">
                  <td className="px-5 py-4 text-navy font-medium">{e.title}</td>
                  <td className="px-5 py-4 text-ink-soft">
                    {e.startsAt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    {e.startTime ? ` · ${e.startTime}` : ""}
                  </td>
                  <td className="px-5 py-4 text-ink-soft hidden md:table-cell">{e.location || "Church premises"}</td>
                  <td className="px-3 py-3 text-right">
                    <DeleteButton endpoint={`/api/admin/events/${e.id}`} itemName={e.title} warning="This event will be removed." />
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
  return prisma.event.findMany({ orderBy: { startsAt: "asc" } });
}
