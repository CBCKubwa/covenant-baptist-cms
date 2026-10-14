"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";

type FormState = { title: string; date: string; time: string; location: string; description: string; registrationUrl: string };
const EMPTY: FormState = { title: "", date: "", time: "", location: "", description: "", registrationUrl: "" };

/** Create an event. It appears on the public Events page until its date has passed. */
export default function EventForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startsAt: `${form.date}T${form.time || "12:00"}` }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save the event.");
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the event.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[640px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <FormField label="Event Title *" value={form.title} onChange={update("title")} required />
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Date *" value={form.date} onChange={update("date")} type="date" required />
        <FormField label="Time" value={form.time} onChange={update("time")} type="time" />
      </div>
      <FormField label="Location" value={form.location} onChange={update("location")} placeholder="Leave blank for the church premises" />
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />
      <FormField label="Registration Link (optional)" value={form.registrationUrl} onChange={update("registrationUrl")} placeholder="https://..." />
      <button type="submit" disabled={saving} className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60">
        {saving && <Loader2 size={14} className="animate-spin" />} {saving ? "Publishing…" : "Publish Event"}
      </button>
    </form>
  );
}
