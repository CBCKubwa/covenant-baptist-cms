import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SermonCard from "@/components/SermonCard";
import { featuredSermon } from "@/lib/content";

export const metadata: Metadata = {
  title: "Teachings | Covenant Baptist Church",
  description: "Browse sermons from Covenant Baptist Church by speaker, scripture, category, and year.",
};

export default function TeachingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Teachings"
        title="Sermon Library"
        description="Every message, searchable by speaker, scripture, category, and year."
      />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <Reveal className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[880px]">
            <SermonCard
              title={featuredSermon.title}
              speaker={featuredSermon.speaker}
              scripture={featuredSermon.scripture}
            />
          </Reveal>
          <p className="mt-8 text-[13px] text-ink-soft">
            One sermon published so far. Search and filtering switch on automatically once more are added.
          </p>
        </div>
      </section>
    </>
  );
}
