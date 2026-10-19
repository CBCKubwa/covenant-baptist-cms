import { pageMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import EventCard from "@/components/EventCard";
import { getUpcomingEvents } from "@/lib/queries";

export const revalidate = 60;

/** Search-engine title/description: editable in Admin -> Search Appearance. */
export const generateMetadata = () => pageMetadata("/events");

export default async function EventsPage() {
  // null = database unreachable -> show the sample event; [] = nothing scheduled.
  const events = await getUpcomingEvents();

  return (
    <>
      <PageHeader eyebrow="What's On" title="Upcoming Events" description="Join us for these gatherings." />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          {events === null ? (
            <Reveal className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-[640px]">
              <EventCard title="Children's Christmas Carol" dateLabel="Dec 2026" description="Hosted by the Children's Department. Exact date and time to be confirmed." />
            </Reveal>
          ) : events.length === 0 ? (
            <p className="text-ink-soft text-sm">No upcoming events are scheduled right now. Please check back soon.</p>
          ) : (
            <Reveal className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {events.map((e) => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  month={e.startsAt.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}
                  day={e.startsAt.toLocaleDateString("en-GB", { day: "numeric", timeZone: "UTC" })}
                  timeLabel={e.startTime}
                  location={e.location}
                  description={e.description}
                  registrationUrl={e.registrationUrl}
                />
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
