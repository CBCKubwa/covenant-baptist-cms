import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } }).catch(() => null);
  if (!article) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Edit Article</h1>
      <p className="text-sm text-ink-soft mb-8">Changes go live as soon as you save.</p>
      <ArticleForm
        initial={{
          id: article.id,
          title: article.title,
          author: article.author ?? "",
          category: article.category ?? "",
          tags: article.tags.join(", "),
          content: article.content,
          featuredImage: article.featuredImage,
        }}
      />
    </div>
  );
}
