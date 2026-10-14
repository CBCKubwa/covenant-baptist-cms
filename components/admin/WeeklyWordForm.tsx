"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";

type FormState = { date: string; quote: string; quoteBy: string; question: string; prayer: string; scripture: string };

/** The Monday of the week containing a yyyy-mm-dd date, as a readable label (preview only). */
function weekLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000);
  const sunday = new Date(monday.getTime() + 6 * 86400000);
  const f = (x: Date) => x.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
  return `${f(monday)} – ${f(sunday)}`;
}

/** Schedule the quote / question / prayer for one week. Saving again for the same week replaces it. */
export default function WeeklyWordForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ date: new Date().toISOString().slice(0, 10), quote: "", quoteBy: "", question: "", prayer: "", scripture: "" });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/weekly-word", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setForm((f) => ({ ...f, quote: "", quoteBy: "", question: "", prayer: "", scripture: "" }));
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div>
        <FormField label="Pick any day in the week *" value={form.date} onChange={update("date")} type="date" required />
        {form.date && <p className="mt-1.5 text-xs text-ink-soft">This will run for the week of <strong className="text-navy">{weekLabel(form.date)}</strong> (Monday to Sunday).</p>}
      </div>
      <FormField label="Quote of the week *" value={form.quote} onChange={update("quote")} textarea />
      <FormField label="Quote by" value={form.quoteBy} onChange={update("quoteBy")} placeholder="Speaker name" />
      <FormField label="Question of the week *" value={form.question} onChange={update("question")} textarea />
      <FormField label="Prayer of the week *" value={form.prayer} onChange={update("prayer")} textarea />
      <FormField label="Scripture (optional)" value={form.scripture} onChange={update("scripture")} />
      <button type="submit" disabled={status === "saving"} className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60">
        {status === "saving" && <Loader2 size={14} className="animate-spin" />} {status === "saving" ? "Saving…" : "Schedule for this week"}
      </button>
      {status === "saved" && <p role="status" className="text-xs text-green-700 -mt-2">Saved. It will appear on the homepage when that week begins.</p>}
    </form>
  );
}
