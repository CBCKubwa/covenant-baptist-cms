import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminArticlesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-navy">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy text-parchment text-sm font-semibold hover:bg-midnight transition"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>
      <div className="bg-white border border-dashed border-navy/20 rounded-md p-10 text-center">
        <p className="text-ink-soft text-sm">No articles published yet. Create the first one to see it here.</p>
      </div>
      <p className="mt-4 text-xs text-ink-soft">
        Once the database is connected, articles published here appear immediately on the public Resources page.
      </p>
    </div>
  );
}
