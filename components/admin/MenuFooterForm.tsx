"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";

export type MenuItemValue = {
  /** Key: the link ("/about") or "cta" / "prayer" */
  key: string;
  /** Where it appears, shown as a hint */
  where: string;
  /** Built-in label (used when the box is empty) */
  defaultLabel: string;
  /** Label live right now */
  label: string;
};

type Props = {
  items: MenuItemValue[];
  copyright: string;
  defaultCopyright: string;
};

const MAX = 30;

/** Menu labels (links never change) + the footer copyright line. */
export default function MenuFooterForm({ items, copyright, defaultCopyright }: Props) {
  const router = useRouter();
  const [labels, setLabels] = useState<Record<string, string>>(Object.fromEntries(items.map((i) => [i.key, i.label])));
  const [copy, setCopy] = useState(copyright);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navLabels: labels, copyrightText: copy }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not save.");
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setStatus("idle");
    }
  }

  const heading = "block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3";
  const year = new Date().getFullYear();
  const preview = (copy.trim() || defaultCopyright).split("{year}").join(String(year));

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-8 max-w-[680px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div>
        <span className={heading}>Menu labels</span>
        <p className="text-sm text-ink-soft mb-4">Rename what each menu item says. The page it opens never changes. Clear a box to go back to the original name.</p>
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.key}>
              <FormField
                label={`${item.defaultLabel} — ${item.where}`}
                value={labels[item.key] ?? ""}
                onChange={(e) => setLabels((l) => ({ ...l, [item.key]: e.target.value }))}
                placeholder={item.defaultLabel}
              />
              {(labels[item.key] ?? "").length > MAX && <p className="mt-1 text-xs text-red-600">Please keep this to {MAX} characters or fewer.</p>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className={heading}>Footer</span>
        <FormField label="Copyright line" value={copy} onChange={(e) => setCopy(e.target.value)} placeholder={defaultCopyright} />
        <p className="mt-1.5 text-xs text-ink-soft">
          Type <code className="bg-parchment px-1 rounded">{"{year}"}</code> where the year should go and it will always show the current year.
        </p>
        <p className="mt-3 text-sm text-ink-soft"><span className="text-xs uppercase tracking-wide text-ink-soft/70">Preview:</span> {preview}</p>
      </div>

      <button type="submit" disabled={status === "saving"} className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60">
        {status === "saving" && <Loader2 size={14} className="animate-spin" />} {status === "saving" ? "Saving…" : "Save changes"}
      </button>
      {status === "saved" && <p role="status" className="text-xs text-green-700 -mt-4">Saved. The menu and footer now show this.</p>}
    </form>
  );
}
