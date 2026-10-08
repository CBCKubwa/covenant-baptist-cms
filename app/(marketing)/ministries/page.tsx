import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MinistryAccordion from "@/components/MinistryAccordion";
import { ministries } from "@/lib/ministries";

export const metadata: Metadata = {
  title: "Ministries | Covenant Baptist Church",
  description: "Ministries and ways to get involved at Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function MinistriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get Involved"
        title="Ministries"
        description="Seven ministries, each with its own heart for the church. Tap any one to read more."
      />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[820px] mx-auto">
          <Reveal className="space-y-4">
            {ministries.map((m) => (
              <MinistryAccordion key={m.slug} ministry={m} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
