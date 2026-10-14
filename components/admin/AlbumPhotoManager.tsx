"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { uploadFile } from "@/lib/client-upload";
import DeleteButton from "./DeleteButton";

type Photo = { id: string; url: string; caption: string | null };

/**
 * Photo grid for one album: multi-select upload + a delete button on every photo.
 * Files are uploaded one after another (gentler on slow connections), then all
 * saved to the album in a single request.
 */
export default function AlbumPhotoManager({ albumId, photos }: { albumId: string; photos: Photo[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    setError("");

    const uploaded: { url: string }[] = [];
    const failed: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setStatus(`Uploading ${i + 1} of ${files.length}…`);
      try {
        uploaded.push({ url: await uploadFile(files[i], "image") });
      } catch (e) {
        failed.push(`${files[i].name}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }

    try {
      if (uploaded.length > 0) {
        setStatus("Saving…");
        const res = await fetch(`/api/admin/albums/${albumId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: uploaded }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not save photos.");
      }
      if (failed.length > 0) setError(`Some files were not uploaded — ${failed.join("; ")}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save photos.");
    } finally {
      setStatus(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = status !== null;

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="w-full border border-dashed border-navy/25 rounded-md p-8 text-center text-ink-soft text-sm flex flex-col items-center gap-2 hover:border-gold hover:text-navy transition disabled:cursor-wait"
      >
        {busy ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
        {busy ? status : "Click to upload photos (you can select many at once)"}
        {!busy && <span className="text-xs text-ink-soft/70">JPG, PNG, WebP · up to 10 MB each</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

      {photos.length === 0 ? (
        <div className="mt-8 text-center text-sm text-ink-soft flex flex-col items-center gap-2">
          <ImageIcon size={26} className="text-ink-soft/40" /> No photos in this album yet.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            <div key={photo.id} className="group relative aspect-square rounded-md overflow-hidden border border-navy/10 bg-navy/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption ?? `Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-1.5 right-1.5 rounded-md bg-white/95 shadow-sm">
                <DeleteButton endpoint={`/api/admin/photos/${photo.id}`} itemName={photo.caption || `Photo ${i + 1}`} warning="This photo will be removed from the album and deleted from storage." />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
