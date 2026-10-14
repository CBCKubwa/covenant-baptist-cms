import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Event</h1>
      <p className="text-sm text-ink-soft mb-8">Fill in the details and click Publish. It will appear on the Events page until its date has passed.</p>
      <EventForm />
    </div>
  );
}
