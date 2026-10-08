"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import FormField from "./FormField";

type FormState = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  registrationUrl: string;
};
const EMPTY: FormState = { title: "", date: "", time: "", location: "", description: "", registrationUrl: "" };

export default function EventForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, startsAt: form.date + "T" + (form.time || "12:00") }) });
      if (!res.ok) throw new Error("Failed to save event");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Could not save the event. Make sure the database is configured.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-navy/10 rounded-md p-8 text-center">
        <p className="font-serif text-lg text-navy">&ldquo;{form.title || "Untitled event"}&rdquo; is ready.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          The event has been saved to the church database and is now available to the website.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[640px]">
      <FormField label="Event Title" value={form.title} onChange={update("title")} required />
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Date" value={form.date} onChange={update("date")} type="date" required />
        <FormField label="Time" value={form.time} onChange={update("time")} type="time" />
      </div>
      <FormField label="Location" value={form.location} onChange={update("location")} placeholder="Defaults to the church address" />
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />
      <FormField
        label="Registration Link (optional)"
        value={form.registrationUrl}
        onChange={update("registrationUrl")}
        placeholder="https://..."
      />
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">Event Image</label>
        <div className="border border-dashed border-navy/25 rounded-md p-5 text-center text-ink-soft text-xs flex flex-col items-center gap-2">
          <Upload size={18} />
          Upload Image
        </div>
      </div>
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Publish Event
      </button>
    </form>
  );
}
