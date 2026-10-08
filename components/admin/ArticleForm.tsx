"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import FormField from "./FormField";

type FormState = { title: string; author: string; category: string; content: string };
const EMPTY: FormState = { title: "", author: "", category: "", content: "" };

export default function ArticleForm() {
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
        <p className="font-serif text-lg text-navy">&ldquo;{form.title || "Untitled article"}&rdquo; is ready.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          Nothing was actually saved &mdash; once Phase 3 connects the database, publishing here will really put it
          on the Resources page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[640px]">
      <FormField label="Title" value={form.title} onChange={update("title")} required />
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Author" value={form.author} onChange={update("author")} />
        <FormField label="Category" value={form.category} onChange={update("category")} placeholder="e.g. Devotional" />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">Featured Image</label>
        <div className="border border-dashed border-navy/25 rounded-md p-5 text-center text-ink-soft text-xs flex flex-col items-center gap-2">
          <Upload size={18} />
          Upload Image
        </div>
      </div>
      <FormField label="Content" value={form.content} onChange={update("content")} textarea required />
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Publish Article
      </button>
    </form>
  );
}
