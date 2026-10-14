import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminPageHeader, { DbError } from "@/components/admin/AdminPageHeader";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  let articles: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    articles = await load();
  } catch (error) {
    console.error("[admin/articles] load failed:", error);
    dbError = true;
  }

  return (
    <div>
      <AdminPageHeader
        title="Articles"
        description="Reflections and teaching shown on the public Resources page."
        actionHref="/admin/articles/new"
        actionLabel="New Article"
      />
      {dbError && <DbError />}

      <div className="bg-white border border-navy/10 rounded-md overflow-hidden overflow-x-auto">
        {articles.length === 0 && !dbError ? (
          <p className="p-10 text-center text-sm text-ink-soft">No articles yet. Click &ldquo;New Article&rdquo; to publish the first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-parchment/50 text-left text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Author</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">Published</th>
                <th className="px-5 py-3 w-28"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-t border-navy/10">
                  <td className="px-5 py-4">
                    <div className="text-navy font-medium">{a.title}</div>
                    {a.category && <div className="text-xs text-ink-soft">{a.category}</div>}
                  </td>
                  <td className="px-5 py-4 text-ink-soft hidden md:table-cell">{a.author || "—"}</td>
                  <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{(a.publishedAt ?? a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/articles/${a.id}`} aria-label={`Edit ${a.title}`} title="Edit" className="inline-flex p-2 rounded-md text-ink-soft hover:text-navy hover:bg-parchment/60 transition">
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton endpoint={`/api/admin/articles/${a.id}`} itemName={a.title} />
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
  return prisma.article.findMany({ orderBy: { createdAt: "desc" } });
}
