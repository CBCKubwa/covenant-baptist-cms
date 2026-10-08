"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import FormField from "./FormField";

type FormState = {
  title: string;
  speaker: string;
  scripture: string;
  description: string;
  quote: string;
  question: string;
  prayer: string;
};

const EMPTY: FormState = { title: "", speaker: "", scripture: "", description: "", quote: "", question: "", prayer: "" };

export default function SermonForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const update =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/sermons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed to save sermon");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Could not save the sermon. Make sure the database is configured.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-navy/10 rounded-md p-8 text-center">
        <p className="font-serif text-lg text-navy">&ldquo;{form.title || "Untitled sermon"}&rdquo; is ready.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          The sermon has been saved to the church database and is now available to the website.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[640px]">
      <FormField label="Title" value={form.title} onChange={update("title")} required />
      <FormField label="Speaker" value={form.speaker} onChange={update("speaker")} required />
      <FormField label="Scripture" value={form.scripture} onChange={update("scripture")} placeholder="e.g. Matthew 9:35-39" />
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="border border-dashed border-navy/25 rounded-md p-5 text-center text-ink-soft text-xs flex flex-col items-center gap-2">
          <Upload size={18} />
          Upload Audio
        </div>
        <div className="border border-dashed border-navy/25 rounded-md p-5 text-center text-ink-soft text-xs flex flex-col items-center gap-2">
          <Upload size={18} />
          Upload Video (or paste a YouTube link)
        </div>
      </div>
      <FormField label="Quote of the Day" value={form.quote} onChange={update("quote")} textarea />
      <FormField label="Question of the Day" value={form.question} onChange={update("question")} textarea />
      <FormField label="Prayer of the Day" value={form.prayer} onChange={update("prayer")} textarea />
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Publish
      </button>
    </form>
  );
}
