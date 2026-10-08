import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Event</h1>
      <p className="text-sm text-ink-soft mb-8">Fill this in, click Publish. Once live, this becomes real.</p>
      <EventForm />
    </div>
  );
}
