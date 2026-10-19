import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getArticleBySlug } from "@/lib/queries";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title, // the church name is added automatically by the site-wide title template
    description: article.content.replace(/\s+/g, " ").slice(0, 155),
  };
}

/** A single article. The text is rendered as plain paragraphs (never as HTML), so it is safe. */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = article.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="bg-white pt-28 pb-20 px-6">
      <div className="max-w-[720px] mx-auto">
        <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-navy mb-8">
          <ArrowLeft size={14} /> All articles
        </Link>
        {article.category && <span className="block text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold mb-3">{article.category}</span>}
        <h1 className="font-serif text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-navy">{article.title}</h1>
        <p className="mt-4 text-sm text-ink-soft">
          {article.author && <>By {article.author} · </>}
          {(article.publishedAt ?? article.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {article.featuredImage && (
          <div className="relative aspect-[16/9] rounded-sm overflow-hidden mt-8">
            <Image src={article.featuredImage} alt="" fill priority sizes="720px" className="object-cover" />
          </div>
        )}

        <div className="mt-10 space-y-5 text-[16.5px] leading-[1.8] text-ink">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">{p}</p>
          ))}
        </div>

        {article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-parchment text-xs text-navy">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
