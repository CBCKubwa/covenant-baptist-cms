import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources | Covenant Baptist Church",
  description: "Articles and devotional content from Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Articles & Devotionals"
        description="Reflections and teaching to read between Sundays."
      />
      <section className="bg-white py-20 md:py-28 px-6">
        <Reveal className="max-w-[440px] mx-auto text-center">
          <BookOpen size={28} className="mx-auto text-gold mb-5" />
          <p className="font-serif text-lg text-navy mb-2">The first article is on its way.</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            Check back soon, or follow along on WhatsApp for updates the moment something new is published.
          </p>
        </Reveal>
      </section>
    </>
  );
}
