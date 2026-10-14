import Link from "next/link";
import { Plus } from "lucide-react";

/** Consistent page title row used by all admin list screens. */
export default function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
      <div>
        <h1 className="font-serif text-2xl text-navy">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-soft max-w-[60ch]">{description}</p>}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy text-parchment text-sm font-semibold hover:bg-midnight transition"
        >
          <Plus size={16} /> {actionLabel}
        </Link>
      )}
    </div>
  );
}

/** Red notice shown when the database could not be reached. */
export function DbError() {
  return (
    <div role="alert" className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      Could not load data from the database. Check that <code>DATABASE_URL</code> is set correctly, then refresh.
    </div>
  );
}
