"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Upload } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";
import { uploadFile } from "@/lib/client-upload";

/**
 * "Change church logo" card. Uploading stores the image in cloud storage and saves
 * its URL in Site Settings, so every page picks it up. "Reset" returns to the
 * bundled default logo.
 */
export default function LogoManager({ currentLogo }: { currentLogo: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const busy = progress !== null || saving;

  async function saveLogo(logoUrl: string | null) {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not save the logo.");
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    setProgress(0);
    try {
      const url = await uploadFile(file, "image", setProgress);
      setProgress(null);
      setSaving(true);
      await saveLogo(url);
      setMessage({ type: "ok", text: "Logo updated. It is now live across the site." });
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
      await saveLogo(null);
      setMessage({ type: "ok", text: "Restored the original church logo." });
      router.refresh();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Could not reset the logo." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-white border border-navy/10 rounded-md p-7 max-w-[560px]">
      <h2 className="font-serif text-lg text-navy">Church logo</h2>
      <p className="mt-1 text-sm text-ink-soft">Use a square PNG with a transparent background (at least 400 × 400 px) for the best result.</p>

      <div className="mt-6 flex items-center gap-6">
        <div className="w-28 h-28 rounded-md bg-midnight flex items-center justify-center shrink-0">
          <SiteLogo src={currentLogo} size={88} />
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-navy text-parchment text-sm font-semibold hover:bg-midnight transition disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {progress !== null ? `Uploading ${progress}%` : saving ? "Saving…" : "Upload new logo"}
          </button>
          {currentLogo && (
            <button
              type="button"
              disabled={busy}
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md border border-navy/15 text-sm text-ink-soft hover:text-navy hover:border-navy/30 transition disabled:opacity-60"
            >
              <RotateCcw size={14} /> Use original logo
            </button>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      {message && (
        <p role={message.type === "error" ? "alert" : "status"} className={`mt-4 text-sm ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </section>
  );
}
