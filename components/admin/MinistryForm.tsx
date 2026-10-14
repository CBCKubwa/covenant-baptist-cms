"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import FormField from "./FormField";
import FileUploader from "./FileUploader";

/** Form-side section: the body is plain text; "list" turns each line into a bullet. */
type Section = { heading: string; body: string; list: boolean };
type Initial = { id: string; name: string; blurb: string; order: number; image: string | null; sections: Section[] };

/** Create (no `initial`) or edit (`initial` given) a ministry. */
export default function MinistryForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [order, setOrder] = useState(initial ? String(initial.order) : "");
  const [image, setImage] = useState<string | null>(initial?.image ?? null);
  const [sections, setSections] = useState<Section[]>(initial?.sections.length ? initial.sections : [{ heading: "", body: "", list: false }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateSection = (i: number, patch: Partial<Section>) =>
    setSections((s) => s.map((sec, idx) => (idx === i ? { ...sec, ...patch } : sec)));
  const addSection = () => setSections((s) => [...s, { heading: "", body: "", list: false }]);
  const removeSection = (i: number) => setSections((s) => s.filter((_, idx) => idx !== i));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Convert to the stored shape: bullet lists become arrays of lines.
      const payload = {
        name, blurb, order, image,
        sections: sections.map((s) => ({
          heading: s.heading,
          body: s.list ? s.body.split("\n").map((l) => l.trim()).filter(Boolean) : s.body,
        })),
      };
      const res = await fetch(initial ? `/api/admin/ministries/${initial.id}` : "/api/admin/ministries", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save the ministry.");
      router.push("/admin/ministries");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the ministry.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[680px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <FormField label="Ministry name *" value={name} onChange={(e) => setName(e.target.value)} required />
      <FormField label="Short blurb (shown when collapsed) *" value={blurb} onChange={(e) => setBlurb(e.target.value)} required />
      <div className="grid sm:grid-cols-2 gap-5 items-start">
        <FormField label="Display order (lowest first)" value={order} onChange={(e) => setOrder(e.target.value)} type="number" placeholder="Leave blank to add at the end" />
        <FileUploader label="Photo (optional)" kind="image" value={image} onChange={setImage} />
      </div>

      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-2">Sections (shown when expanded)</label>
        <div className="grid gap-3">
          {sections.map((sec, i) => (
            <div key={i} className="border border-navy/10 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-ink-soft">Section {i + 1}</span>
                {sections.length > 1 && (
                  <button type="button" onClick={() => removeSection(i)} aria-label={`Remove section ${i + 1}`} className="text-ink-soft hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid gap-3">
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) => updateSection(i, { heading: e.target.value })}
                  placeholder="Heading, e.g. Our Vision"
                  aria-label={`Section ${i + 1} heading`}
                  className="w-full border border-navy/15 rounded-md px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
                />
                <textarea
                  value={sec.body}
                  onChange={(e) => updateSection(i, { body: e.target.value })}
                  placeholder={sec.list ? "One bullet point per line" : "Body text"}
                  aria-label={`Section ${i + 1} text`}
                  rows={sec.list ? 5 : 3}
                  className="w-full border border-navy/15 rounded-md px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
                />
                <label className="inline-flex items-center gap-2 text-xs text-ink-soft">
                  <input type="checkbox" checked={sec.list} onChange={(e) => updateSection(i, { list: e.target.checked })} />
                  Show as a bullet list (one bullet per line)
                </label>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSection} className="inline-flex items-center gap-1.5 mt-3 text-[13px] text-navy font-semibold hover:text-gold transition">
          <Plus size={14} /> Add section
        </button>
      </div>

      <button type="submit" disabled={saving} className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60">
        {saving && <Loader2 size={14} className="animate-spin" />} {saving ? "Saving…" : initial ? "Save changes" : "Publish ministry"}
      </button>
    </form>
  );
}
