"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export type SeoRow = {
  path: string;
  label: string;
  /** Built-in title / description, shown as grey placeholders (used when the box is empty) */
  defaultTitle: string;
  defaultDescription: string;
  /** The admin's own text ("" = none) */
  title: string;
  description: string;
};

const MAX_TITLE = 120;
const MAX_DESCRIPTION = 320;
// Google usually shows about this much before cutting the text off.
const GOOD_TITLE = 60;
const GOOD_DESCRIPTION = 160;

/** Counter that turns amber when the text is likely to be cut off in Google. */
function Counter({ value, good, max }: { value: number; good: number; max: number }) {
  const tone = value > max ? "text-red-600" : value > good ? "text-amber-600" : "text-ink-soft/70";
  return <span className={`text-[11px] ${tone}`}>{value}/{good} recommended</span>;
}

/**
 * What Google (and WhatsApp / Facebook link previews) show for each page.
 * Boxes stay EMPTY unless the admin writes something, so the built-in text keeps following
 * the church name automatically.
 */
export default function SearchAppearanceForm({ rows }: { rows: SeoRow[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, { title: string; description: string }>>(
    Object.fromEntries(rows.map((r) => [r.path, { title: r.title, description: r.description }]))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  const set = (path: string, key: "title" | "description", value: string) =>
    setValues((v) => ({ ...v, [path]: { ...v[path], [key]: value } }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seo: values }) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not save.");
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setStatus("idle");
    }
  }

  const inputCls = "w-full border border-navy/15 rounded-md px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="max-w-[760px] grid gap-4">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {rows.map((row) => {
        const v = values[row.path];
        const shownTitle = v.title.trim() || row.defaultTitle;
        const shownDescription = v.description.trim() || row.defaultDescription;
        const customised = !!(v.title.trim() || v.description.trim());
        return (
          <details key={row.path} className="group bg-white border border-navy/10 rounded-md" open={row.path === "/"}>
            <summary className="list-none cursor-pointer px-6 py-4 flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <span className="font-serif text-navy">{row.label}</span>
              <span className="text-xs text-ink-soft">
                {customised ? <span className="px-2 py-0.5 rounded-full bg-gold/15 text-navy font-semibold">Custom</span> : "Built-in text"}
                <span className="ml-3 group-open:hidden">Edit ▾</span>
                <span className="ml-3 hidden group-open:inline">Close ▴</span>
              </span>
            </summary>

            <div className="px-6 pb-6 grid gap-4">
              {/* Live preview, styled like a Google result */}
              <div className="rounded-md bg-parchment/50 border border-navy/10 p-4">
                <div className="text-[11px] uppercase tracking-wide text-ink-soft/70 mb-1.5">How it may look in Google</div>
                <div className="text-[#1a0dab] text-[17px] leading-snug truncate">{shownTitle}</div>
                <div className="text-[13px] text-[#006621] truncate">your-website.com{row.path === "/" ? "" : row.path}</div>
                <div className="text-[13px] text-ink-soft leading-snug line-clamp-2">{shownDescription}</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11.5px] font-semibold text-ink-soft" htmlFor={`t-${row.path}`}>Title</label>
                  <Counter value={v.title.length} good={GOOD_TITLE} max={MAX_TITLE} />
                </div>
                <input id={`t-${row.path}`} type="text" value={v.title} onChange={(e) => set(row.path, "title", e.target.value)} placeholder={row.defaultTitle} className={inputCls} maxLength={MAX_TITLE + 40} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11.5px] font-semibold text-ink-soft" htmlFor={`d-${row.path}`}>Description</label>
                  <Counter value={v.description.length} good={GOOD_DESCRIPTION} max={MAX_DESCRIPTION} />
                </div>
                <textarea id={`d-${row.path}`} rows={3} value={v.description} onChange={(e) => set(row.path, "description", e.target.value)} placeholder={row.defaultDescription} className={inputCls} />
              </div>
              {customised && (
                <button type="button" onClick={() => setValues((all) => ({ ...all, [row.path]: { title: "", description: "" } }))} className="justify-self-start text-[13px] text-ink-soft underline underline-offset-2 hover:text-navy">
                  Go back to the built-in text
                </button>
              )}
            </div>
          </details>
        );
      })}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={status === "saving"} className="inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60">
          {status === "saving" && <Loader2 size={14} className="animate-spin" />} {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && <span role="status" className="text-xs text-green-700">Saved. Google can take days or weeks to show new text.</span>}
      </div>
    </form>
  );
}
