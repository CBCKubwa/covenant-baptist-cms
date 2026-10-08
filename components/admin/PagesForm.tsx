"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import FormField from "./FormField";
import { pageContent } from "@/lib/content";

export default function PagesForm() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...pageContent });

  const update = (key: keyof typeof pageContent) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-6 max-w-[640px]">
      <div>
        <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-2">Homepage</span>
        <FormField label="“Who We Are” paragraph" value={form.homeIntro} onChange={update("homeIntro")} textarea />
      </div>
      <div>
        <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-2">About</span>
        <FormField label="Page intro line" value={form.aboutIntro} onChange={update("aboutIntro")} textarea />
      </div>
      <div>
        <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-2">Plan Your Visit</span>
        <FormField
          label="“First Time Here?” text"
          value={form.visitWhatToExpect}
          onChange={update("visitWhatToExpect")}
          textarea
        />
      </div>
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Save Changes
      </button>
      {saved && (
        <p className="text-xs text-green-700 -mt-3">
          Saved locally in this form only &mdash; not yet connected to make it live sitewide.
        </p>
      )}
    </form>
  );
}
