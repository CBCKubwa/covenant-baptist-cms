import { prisma } from "@/lib/prisma";
import { DbError } from "./AdminPageHeader";
import SubmissionActions from "./SubmissionActions";

/**
 * Inbox list shared by Messages and Prayer Requests. Unread items are highlighted and
 * sorted to the top; each one expands to show the full text.
 */
export default async function SubmissionList({ type, emptyText }: { type: "CONTACT" | "PRAYER"; emptyText: string }) {
  let items: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    items = await load(type);
  } catch (error) {
    console.error(`[admin/submissions:${type}] load failed:`, error);
    dbError = true;
  }

  if (dbError) return <DbError />;
  if (items.length === 0) {
    return <div className="bg-white border border-dashed border-navy/20 rounded-md p-10 text-center text-sm text-ink-soft">{emptyText}</div>;
  }

  return (
    <div className="grid gap-3 max-w-[820px]">
      {items.map((m) => {
        const unread = m.status === "UNREAD";
        return (
          <details key={m.id} className={`group bg-white border rounded-md ${unread ? "border-gold/60" : "border-navy/10"}`}>
            <summary className="list-none cursor-pointer px-5 py-4 flex items-start gap-3 [&::-webkit-details-marker]:hidden">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${unread ? "bg-gold" : "bg-transparent"}`} aria-label={unread ? "Unread" : undefined} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className={`text-sm ${unread ? "font-semibold text-navy" : "text-navy"}`}>{m.name || "Anonymous"}</span>
                  <span className="text-xs text-ink-soft">
                    {m.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </span>
                <span className="block mt-0.5 text-sm text-ink-soft line-clamp-1 group-open:hidden">{m.message}</span>
              </span>
            </summary>
            <div className="px-5 pb-5 pl-10">
              <p className="whitespace-pre-line text-sm text-ink leading-relaxed">{m.message}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
                {m.email && <a href={`mailto:${m.email}`} className="text-navy underline underline-offset-2">{m.email}</a>}
                {m.phone && <a href={`tel:${m.phone}`} className="text-navy underline underline-offset-2">{m.phone}</a>}
              </div>
              <div className="mt-3 -ml-3">
                <SubmissionActions id={m.id} status={m.status} label={`message from ${m.name || "Anonymous"}`} />
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}

function load(type: string) {
  return prisma.formSubmission.findMany({
    where: { type },
    orderBy: [{ status: "desc" }, { createdAt: "desc" }], // "UNREAD" sorts after "READ", so desc puts unread first
    take: 200,
  });
}
