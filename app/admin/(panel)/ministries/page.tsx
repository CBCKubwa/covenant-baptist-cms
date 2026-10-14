import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminPageHeader, { DbError } from "@/components/admin/AdminPageHeader";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminMinistriesPage() {
  let ministries: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    ministries = await load();
  } catch (error) {
    console.error("[admin/ministries] load failed:", error);
    dbError = true;
  }

  return (
    <div>
      <AdminPageHeader
        title="Ministries"
        description="The departments shown on the public Ministries page, in the order listed here."
        actionHref="/admin/ministries/new"
        actionLabel="New Ministry"
      />
      {dbError && <DbError />}

      <div className="bg-white border border-navy/10 rounded-md overflow-hidden overflow-x-auto">
        {ministries.length === 0 && !dbError ? (
          <p className="p-10 text-center text-sm text-ink-soft">No ministries yet. Click &ldquo;New Ministry&rdquo; to add one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-parchment/50 text-left text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold w-16">Order</th>
                <th className="px-5 py-3 font-semibold">Ministry</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">Sections</th>
                <th className="px-5 py-3 w-28"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {ministries.map((m) => (
                <tr key={m.id} className="border-t border-navy/10">
                  <td className="px-5 py-4 text-ink-soft">{m.order}</td>
                  <td className="px-5 py-4">
                    <div className="text-navy font-medium">{m.name}</div>
                    <div className="text-xs text-ink-soft line-clamp-1">{m.blurb}</div>
                  </td>
                  <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{Array.isArray(m.sections) ? m.sections.length : 0}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/ministries/${m.id}`} aria-label={`Edit ${m.name}`} title="Edit" className="inline-flex p-2 rounded-md text-ink-soft hover:text-navy hover:bg-parchment/60 transition">
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton endpoint={`/api/admin/ministries/${m.id}`} itemName={m.name} />
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
  return prisma.ministry.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}
