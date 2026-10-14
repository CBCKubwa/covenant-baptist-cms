import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { BookOpen } from "lucide-react";
import { getPublishedArticles } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Resources | Covenant Baptist Church",
  description: "Articles and devotional content from Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

/** First ~160 characters of the article, cut at a word boundary. */
function excerpt(text: string) {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= 160 ? flat : `${flat.slice(0, 160).replace(/\s+\S*$/, "")}…`;
}

export default async function ResourcesPage() {
  const articles = await getPublishedArticles(); // null (database unreachable) is treated like "none yet"

  return (
    <>
      <PageHeader eyebrow="Resources" title="Articles & Devotionals" description="Reflections and teaching to read between Sundays." />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          {!articles || articles.length === 0 ? (
            <Reveal className="max-w-[440px] mx-auto text-center py-6">
              <BookOpen size={28} className="mx-auto text-gold mb-5" />
              <p className="font-serif text-lg text-navy mb-2">The first article is on its way.</p>
              <p className="text-sm text-ink-soft leading-relaxed">Check back soon, or follow along on WhatsApp for updates the moment something new is published.</p>
            </Reveal>
          ) : (
            <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link key={a.id} href={`/resources/${a.slug}`} className="group block border border-navy/10 rounded-sm overflow-hidden bg-white hover:border-gold transition">
                  <div className="relative aspect-[16/9] bg-navy/5">
                    {a.featuredImage ? (
                      <Image src={a.featuredImage} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0E1A2B, #09111D)" }} />
                    )}
                  </div>
                  <div className="p-5">
                    {a.category && <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-2">{a.category}</span>}
                    <h2 className="font-serif text-lg text-navy leading-snug group-hover:underline underline-offset-2">{a.title}</h2>
                    <p className="mt-2 text-[13px] text-ink-soft leading-relaxed">{excerpt(a.content)}</p>
                    <p className="mt-3 text-xs text-ink-soft/80">
                      {a.author && <>{a.author} · </>}
                      {(a.publishedAt ?? a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
