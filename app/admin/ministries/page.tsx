import Link from "next/link";
import { Plus } from "lucide-react";
import { ministries } from "@/lib/ministries";

export default function AdminMinistriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-navy">Ministries</h1>
        <Link
          href="/admin/ministries/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy text-parchment text-sm font-semibold hover:bg-midnight transition"
        >
          <Plus size={16} /> New Ministry
        </Link>
      </div>
      <div className="bg-white border border-navy/10 rounded-md overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-parchment/50 text-left text-ink-soft text-xs uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 font-semibold">Ministry</th>
              <th className="px-5 py-3 font-semibold hidden sm:table-cell">Sections</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {ministries.map((m) => (
              <tr key={m.slug} className="border-t border-navy/10">
                <td className="px-5 py-4 text-navy font-medium">{m.name}</td>
                <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{m.sections.length}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Published
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink-soft">
        All seven ministries you provided are already real and live. Once the database is connected, this list
        becomes editable instead of read-only.
      </p>
    </div>
  );
}
