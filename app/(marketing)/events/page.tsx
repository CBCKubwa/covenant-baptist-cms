import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import EventCard from "@/components/EventCard";

export const metadata: Metadata = {
  title: "Events | Covenant Baptist Church",
  description: "Upcoming events at Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="What's On"
        title="Upcoming Events"
        description="Each event gets its own countdown, map, and share buttons once it's added in the admin."
      />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <Reveal className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-[640px]">
            <EventCard
              title="Children's Christmas Carol"
              dateLabel="Dec 2026"
              description="Hosted by the Children's Department. Exact date and time to be confirmed."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
