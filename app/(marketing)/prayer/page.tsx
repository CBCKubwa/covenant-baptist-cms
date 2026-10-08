import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PrayerForm from "@/components/PrayerForm";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Prayer Requests | Covenant Baptist Church",
  description: "Share a prayer request with Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function PrayerPage() {
  return (
    <>
      <PageHeader
        eyebrow="We're Here for You"
        title="Let Us Pray With You"
        description="Whatever you're carrying, you don't have to carry it alone."
      />
      <section className="bg-parchment py-16 md:py-24 px-6">
        <div className="max-w-[640px] mx-auto">
          <Reveal className="flex gap-3 bg-white rounded-md p-5 mb-8 text-[13px] text-ink-soft leading-relaxed">
            <ShieldCheck size={18} className="shrink-0 text-gold mt-0.5" />
            <span>Your request is seen only by church leadership. It is never published publicly, by default.</span>
          </Reveal>
          <Reveal delay={0.1} className="bg-white rounded-md p-8">
            <PrayerForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
