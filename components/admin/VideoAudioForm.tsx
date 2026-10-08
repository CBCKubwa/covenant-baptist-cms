"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import FormField from "./FormField";

type FormState = { title: string; type: "Video" | "Audio"; link: string; description: string };
const EMPTY: FormState = { title: "", type: "Video", link: "", description: "" };

export default function VideoAudioForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }) as FormState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-navy/10 rounded-md p-8 text-center">
        <p className="font-serif text-lg text-navy">&ldquo;{form.title || "Untitled"}&rdquo; is ready.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          Nothing was actually saved &mdash; once Phase 3 connects the database, this will really appear under Media
          &rarr; {form.type}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      <FormField label="Title" value={form.title} onChange={update("title")} required />
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">Type</label>
        <div className="flex gap-2">
          {(["Video", "Audio"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              className={`px-4 py-2 rounded-md text-sm border ${
                form.type === t ? "bg-navy text-parchment border-navy" : "border-navy/15 text-ink-soft"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <FormField
        label="Link (YouTube, SoundCloud, etc.)"
        value={form.link}
        onChange={update("link")}
        placeholder="https://..."
      />
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">Or Upload a File</label>
        <div className="border border-dashed border-navy/25 rounded-md p-5 text-center text-ink-soft text-xs flex flex-col items-center gap-2">
          <Upload size={18} />
          Upload {form.type}
        </div>
      </div>
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Publish
      </button>
    </form>
  );
}
