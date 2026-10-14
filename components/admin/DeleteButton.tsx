"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

type Props = {
  /** API URL that handles DELETE, e.g. /api/admin/sermons/abc123 */
  endpoint: string;
  /** Shown in the confirmation: Delete "Walking in Grace"? */
  itemName: string;
  /** Extra warning line, e.g. "All 12 photos will be removed too." */
  warning?: string;
  /** Go here after deleting (for delete buttons placed on a detail page). */
  redirectTo?: string;
  /** "icon" = compact trash icon (tables / thumbnails), "button" = labelled button. */
  variant?: "icon" | "button";
  label?: string;
};

/**
 * Delete button that ALWAYS asks for confirmation first, so a mis-click cannot
 * wipe a sermon or an album. On success it refreshes the page data.
 */
export default function DeleteButton({ endpoint, itemName, warning, redirectTo, variant = "icon", label = "Delete" }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Escape closes the dialog; focus starts on the safe "Cancel" button.
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  async function confirmDelete() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete. Please try again.");
      }
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Delete ${itemName}`}
          title="Delete"
          className="p-2 rounded-md text-ink-soft hover:text-red-600 hover:bg-red-50 transition"
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
        >
          <Trash2 size={15} /> {label}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[400] bg-midnight/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="del-title"
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 size={20} />
            </div>
            <h2 id="del-title" className="font-serif text-lg text-navy">
              Delete &ldquo;{itemName}&rdquo;?
            </h2>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              {warning ?? "Any files uploaded for it will be removed too."} This cannot be undone.
            </p>
            {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button
                ref={cancelRef}
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-md border border-navy/15 text-sm font-semibold text-ink hover:bg-parchment/60 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-70"
              >
                {busy && <Loader2 size={15} className="animate-spin" />}
                {busy ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
