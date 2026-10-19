"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Upload } from "lucide-react";
import { uploadFile } from "@/lib/client-upload";

type Props = {
  /** Which Site Settings field stores the picture, e.g. "visitImageUrl". */
  field: string;
  title: string;
  help: string;
  /** The admin's current upload, or null when the default is in use. */
  current: string | null;
  /** Picture shown when nothing has been uploaded (the bundled default). */
  fallbackSrc: string;
  resetLabel?: string;
  /** Preview shape: "wide" (banner photos), "square" (icons) or "round" (portraits). */
  shape?: "wide" | "square" | "round";
};

/**
 * Reusable "change this picture" card: preview, upload (to cloud storage), and reset to default.
 * The new URL is saved to Site Settings, which refreshes the live page.
 */
export default function SettingImageManager({ field, title, help, current, fallbackSrc, resetLabel = "Use original picture", shape = "wide" }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const busy = progress !== null || saving;

  async function save(url: string | null) {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: url }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not save the picture.");
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    setProgress(0);
    try {
      const url = await uploadFile(file, "image", setProgress);
      setProgress(null);
      setSaving(true);
      await save(url);
      setMessage({ type: "ok", text: "Picture updated. It is now live on the website." });
      router.refresh();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Upload failed. Please try again." });
    } finally {
      setProgress(null);
      setSaving(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleReset() {
    setMessage(null);
    setSaving(true);
    try {
      await save(null);
      setMessage({ type: "ok", text: "Restored the original picture." });
      router.refresh();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Could not reset the picture." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-white border border-navy/10 rounded-md p-7 max-w-[680px]">
      <h2 className="font-serif text-lg text-navy">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{help}</p>

      <div className={`mt-5 grid gap-4 items-start ${shape === "wide" ? "sm:grid-cols-[220px_1fr]" : "sm:grid-cols-[120px_1fr]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current || fallbackSrc} alt="" className={`w-full object-cover border border-navy/10 bg-navy/5 ${shape === "wide" ? "aspect-[16/9] rounded-md" : shape === "round" ? "aspect-square rounded-full" : "aspect-square rounded-md"}`} />

        <div className="grid gap-3 justify-items-start">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy text-parchment text-sm font-semibold hover:bg-midnight transition disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {progress !== null ? `Uploading ${progress}%` : saving ? "Saving…" : "Upload new picture"}
          </button>
          {current && (
            <button
              type="button"
              disabled={busy}
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-navy/15 text-sm text-ink-soft hover:text-navy hover:border-navy/30 transition disabled:opacity-60"
            >
              <RotateCcw size={14} /> {resetLabel}
            </button>
          )}
          <span className="text-xs text-ink-soft/70">JPG, PNG or WebP · up to 10 MB</span>
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      {message && (
        <p role={message.type === "error" ? "alert" : "status"} className={`mt-4 text-sm ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </section>
  );
}
