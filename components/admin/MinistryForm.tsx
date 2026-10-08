"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import FormField from "./FormField";

type Section = { heading: string; body: string };

export default function MinistryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [sections, setSections] = useState<Section[]>([{ heading: "", body: "" }]);

  const updateSection = (i: number, key: keyof Section, value: string) =>
    setSections((s) => s.map((sec, idx) => (idx === i ? { ...sec, [key]: value } : sec)));
  const addSection = () => setSections((s) => [...s, { heading: "", body: "" }]);
  const removeSection = (i: number) => setSections((s) => s.filter((_, idx) => idx !== i));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-navy/10 rounded-md p-8 text-center">
        <p className="font-serif text-lg text-navy">&ldquo;{name || "Untitled ministry"}&rdquo; is ready.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
          Nothing was actually saved &mdash; once Phase 3 connects the database, this will really appear on the
          Ministries page, in the same expandable format as the other seven.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[640px]">
      <FormField label="Ministry Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <FormField
        label="Short Blurb (shown collapsed)"
        value={blurb}
        onChange={(e) => setBlurb(e.target.value)}
        required
      />

      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-2">Sections (shown when expanded)</label>
        <div className="grid gap-3">
          {sections.map((sec, i) => (
            <div key={i} className="border border-navy/10 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-ink-soft">Section {i + 1}</span>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(i)}
                    aria-label={`Remove section ${i + 1}`}
                    className="text-ink-soft hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid gap-3">
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) => updateSection(i, "heading", e.target.value)}
                  placeholder="Heading, e.g. Our Vision"
                  className="w-full border border-navy/15 rounded-md px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
                />
                <textarea
                  value={sec.body}
                  onChange={(e) => updateSection(i, "body", e.target.value)}
                  placeholder="Body text (one line per bullet if it's a list)"
                  rows={3}
                  className="w-full border border-navy/15 rounded-md px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-1.5 mt-3 text-[13px] text-navy font-semibold hover:text-gold transition"
        >
          <Plus size={14} /> Add Section
        </button>
      </div>

      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Publish Ministry
      </button>
    </form>
  );
}
