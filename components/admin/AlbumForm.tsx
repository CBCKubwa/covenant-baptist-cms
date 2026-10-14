"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";

type FormState = { title: string; date: string; description: string };

/** Create an album, then jump to its page where photos are uploaded. */
export default function AlbumForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ title: "", date: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create the album.");
      router.push(`/admin/albums/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the album.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <FormField label="Album title *" value={form.title} onChange={update("title")} placeholder="e.g. BSF Sunday 2026" required />
      <FormField label="Date" value={form.date} onChange={update("date")} type="date" />
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />
      <button
        type="submit"
        disabled={saving}
        className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60"
      >
        {saving && <Loader2 size={14} className="animate-spin" />} {saving ? "Creating…" : "Create album"}
      </button>
    </form>
  );
}
