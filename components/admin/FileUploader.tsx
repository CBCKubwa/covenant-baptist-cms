"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X, FileAudio, FileVideo } from "lucide-react";
import { UPLOAD_INFO, uploadFile, type UploadKind } from "@/lib/client-upload";

type Props = {
  label: string;
  kind: UploadKind;
  /** Current file URL ("" / null when nothing is uploaded). */
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
};

/**
 * Single-file upload box with progress bar, preview and "remove".
 * Used for sermon audio/video, standalone media and the album cover.
 */
export default function FileUploader({ label, kind, value, onChange, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const info = UPLOAD_INFO[kind];
  const uploading = progress !== null;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      onChange(await uploadFile(file, kind, setProgress));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = ""; // allow re-selecting the same file
    }
  }

  return (
    <div>
      <span className="block text-[11.5px] font-semibold text-ink-soft mb-1.5">{label}</span>

      {value && !uploading ? (
        <div className="border border-navy/15 rounded-md p-3 flex items-center gap-3">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
          ) : kind === "audio" ? (
            <FileAudio size={22} className="text-gold shrink-0" />
          ) : (
            <FileVideo size={22} className="text-gold shrink-0" />
          )}
          <div className="min-w-0 flex-1 text-xs text-ink-soft truncate">Uploaded &#10003; &mdash; {value.split("/").pop()}</div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-ink-soft hover:text-red-600 shrink-0"
            aria-label={`Remove ${info.noun}`}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full border border-dashed border-navy/25 rounded-md p-5 text-center text-ink-soft text-xs flex flex-col items-center gap-2 hover:border-gold hover:text-navy transition disabled:cursor-wait"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading&hellip; {progress}%
              <span className="w-full max-w-[220px] h-1.5 rounded-full bg-navy/10 overflow-hidden">
                <span className="block h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
              </span>
            </>
          ) : (
            <>
              <Upload size={18} />
              Click to upload {info.noun}
              <span className="text-[11px] text-ink-soft/70">{hint ?? `Up to ${info.limitLabel}`}</span>
            </>
          )}
        </button>
      )}

      <input ref={inputRef} type="file" accept={info.accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      {error && <p role="alert" className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
