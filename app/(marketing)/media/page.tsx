import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MediaTabs from "@/components/MediaTabs";

export const metadata: Metadata = {
  title: "Media | Covenant Baptist Church",
  description: "Photos, videos, and audio from Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function MediaPage() {
  return (
    <>
      <PageHeader eyebrow="Media" title="Photos, Videos & Audio" description="A growing archive of church life." />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <Reveal>
            <MediaTabs />
          </Reveal>
        </div>
      </section>
    </>
  );
}
