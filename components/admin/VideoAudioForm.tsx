"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import FileUploader from "./FileUploader";

type MediaType = "VIDEO" | "AUDIO";
type FormState = { title: string; link: string; description: string };

/** Add a standalone video or audio item: upload a file OR paste a link. */
export default function VideoAudioForm() {
  const router = useRouter();
  const [type, setType] = useState<MediaType>("VIDEO");
  const [form, setForm] = useState<FormState>({ title: "", link: "", description: "" });
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, fileUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      router.push("/admin/video-audio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <FormField label="Title *" value={form.title} onChange={update("title")} required />

      <div>
        <span className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">Type</span>
        <div className="flex gap-2">
          {(["VIDEO", "AUDIO"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setFileUrl(null); }} // a video file is not valid as audio, so reset
              className={`px-4 py-2 rounded-md text-sm border ${type === t ? "bg-navy text-parchment border-navy" : "border-navy/15 text-ink-soft"}`}
            >
              {t === "VIDEO" ? "Video" : "Audio"}
            </button>
          ))}
        </div>
      </div>

      <FileUploader label={`Upload ${type === "VIDEO" ? "a video" : "an audio file"}`} kind={type === "VIDEO" ? "video" : "audio"} value={fileUrl} onChange={setFileUrl} />
      <FormField label="…or paste a link (YouTube, etc.)" value={form.link} onChange={update("link")} type="url" placeholder="https://..." />
      <FormField label="Description" value={form.description} onChange={update("description")} textarea />

      <button
        type="submit"
        disabled={saving}
        className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60"
      >
        {saving && <Loader2 size={14} className="animate-spin" />} {saving ? "Publishing…" : "Publish"}
      </button>
    </form>
  );
}
