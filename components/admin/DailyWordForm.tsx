"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import FormField from "./FormField";

type FormState = { date: string; quote: string; quoteBy: string; question: string; prayer: string; scripture: string };
const EMPTY: FormState = { date: "", quote: "", quoteBy: "", question: "", prayer: "", scripture: "" };

export default function DailyWordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const update =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/daily-word", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed to save Daily Word");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Could not save the Daily Word. Make sure the database is configured.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-navy/10 rounded-md p-8 text-center">
        <p className="font-serif text-lg text-navy">Scheduled.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          The Daily Word has been saved to the church database.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      <FormField label="Publication Date" value={form.date} onChange={update("date")} type="date" required />
      <FormField label="Quote" value={form.quote} onChange={update("quote")} textarea required />
      <FormField label="Quote By" value={form.quoteBy} onChange={update("quoteBy")} placeholder="Speaker name" />
      <FormField label="Question" value={form.question} onChange={update("question")} textarea required />
      <FormField label="Prayer" value={form.prayer} onChange={update("prayer")} textarea required />
      <FormField label="Scripture (optional)" value={form.scripture} onChange={update("scripture")} />
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Schedule
      </button>
    </form>
  );
}
