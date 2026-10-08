"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import FormField from "./FormField";

type FormState = { title: string; date: string; description: string };
const EMPTY: FormState = { title: "", date: "", description: "" };

export default function AlbumForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-navy/10 rounded-md p-8 text-center">
        <p className="font-serif text-lg text-navy">&ldquo;{form.title || "Untitled album"}&rdquo; is ready.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          Nothing was actually saved &mdash; once Phase 3 connects the database, creating an album here will really
          add it to the Media page, and you&rsquo;ll be able to upload photos into it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      <FormField label="Album Title" value={form.title} onChange={update("title")} placeholder="e.g. BSF Sunday 2026" required />
      <FormField label="Date" value={form.date} onChange={update("date")} placeholder="e.g. March 2026" />
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">Cover Photo</label>
        <div className="border border-dashed border-navy/25 rounded-md p-5 text-center text-ink-soft text-xs flex flex-col items-center gap-2">
          <Upload size={18} />
          Upload Cover Photo
        </div>
      </div>
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Create Album
      </button>
      <p className="text-xs text-ink-soft -mt-2">
        Photos are added to the album afterward, from the album&rsquo;s own page.
      </p>
    </form>
  );
}
