"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import FileUploader from "./FileUploader";

type FormState = {
  title: string;
  speakerName: string;
  scripture: string;
  category: string;
  date: string;
  youtubeUrl: string;
  description: string;
};

const EMPTY: FormState = {
  title: "", speakerName: "", scripture: "", category: "",
  date: new Date().toISOString().slice(0, 10),
  youtubeUrl: "", description: "",
};

/**
 * Create a sermon. Audio/video are uploaded to cloud storage first
 * (FileUploader); the resulting URLs are then saved with the sermon.
 */
export default function SermonForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, audioUrl, videoUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save the sermon.");
      router.push("/admin/sermons");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the sermon.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[680px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <FormField label="Title *" value={form.title} onChange={update("title")} required />
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Speaker *" value={form.speakerName} onChange={update("speakerName")} required />
        <FormField label="Date preached" value={form.date} onChange={update("date")} type="date" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Scripture *" value={form.scripture} onChange={update("scripture")} placeholder="e.g. Matthew 9:35-39" required />
        <FormField label="Category" value={form.category} onChange={update("category")} placeholder="e.g. Faith, Grace" />
      </div>
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />

      <div className="grid sm:grid-cols-2 gap-4">
        <FileUploader label="Sermon audio" kind="audio" value={audioUrl} onChange={setAudioUrl} />
        <FileUploader label="Sermon video" kind="video" value={videoUrl} onChange={setVideoUrl} />
      </div>
      <FormField label="Or paste a YouTube link" value={form.youtubeUrl} onChange={update("youtubeUrl")} type="url" placeholder="https://www.youtube.com/watch?v=..." />


      <button
        type="submit"
        disabled={saving}
        className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60"
      >
        {saving && <Loader2 size={14} className="animate-spin" />} {saving ? "Publishing…" : "Publish sermon"}
      </button>
    </form>
  );
}
