"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";

export type PagesFormValues = {
  heroTitle: string;
  heroTagline: string;
  heroSubtitle: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  homeIntro: string;
  aboutIntro: string;
  visionFull: string;
  missionStatement: string;
  pastorName: string;
  pastorTitle: string;
  visitWhatToExpect: string;
  serviceTimes: string;
};

/**
 * Editable text on the core pages (homepage banner, About, Plan Your Visit). Saved into Site Settings; clearing a
 * box and saving returns that block to the built-in wording.
 */
export default function PagesForm({ initial }: { initial: PagesFormValues }) {
  const router = useRouter();
  const [form, setForm] = useState<PagesFormValues>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  const update = (key: keyof PagesFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not save.");
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setStatus("idle");
    }
  }

  const heading = "block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-7 max-w-[680px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4">
        <span className={heading}>Homepage banner</span>
        <FormField label="Headline" value={form.heroTitle} onChange={update("heroTitle")} />
        <FormField label="Line under the headline" value={form.heroTagline} onChange={update("heroTagline")} />
        <FormField label="Banner sentence" value={form.heroSubtitle} onChange={update("heroSubtitle")} textarea />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="First button" value={form.heroPrimaryLabel} onChange={update("heroPrimaryLabel")} />
          <FormField label="Second button" value={form.heroSecondaryLabel} onChange={update("heroSecondaryLabel")} />
        </div>
      </div>
      <div>
        <span className={heading}>Homepage</span>
        <FormField label="“Who We Are” paragraph" value={form.homeIntro} onChange={update("homeIntro")} textarea />
      </div>
      <div className="grid gap-4">
        <span className={heading}>About</span>
        <FormField label="Page intro line" value={form.aboutIntro} onChange={update("aboutIntro")} textarea />
        <FormField label="Vision statement" value={form.visionFull} onChange={update("visionFull")} textarea />
        <FormField label="Mission statement" value={form.missionStatement} onChange={update("missionStatement")} textarea />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Pastor's name" value={form.pastorName} onChange={update("pastorName")} />
          <FormField label="Pastor's title (optional)" value={form.pastorTitle} onChange={update("pastorTitle")} placeholder="e.g. Senior Pastor" />
        </div>
      </div>
      <div className="grid gap-4">
        <span className={heading}>Plan Your Visit</span>
        <FormField label="Service times (one per line)" value={form.serviceTimes} onChange={update("serviceTimes")} textarea />
        <FormField label="“First Time Here?” text" value={form.visitWhatToExpect} onChange={update("visitWhatToExpect")} textarea />
      </div>

      <button type="submit" disabled={status === "saving"} className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60">
        {status === "saving" && <Loader2 size={14} className="animate-spin" />} {status === "saving" ? "Saving…" : "Save changes"}
      </button>
      {status === "saved" && <p role="status" className="text-xs text-green-700 -mt-4">Saved. The website now shows this text.</p>}
    </form>
  );
}
