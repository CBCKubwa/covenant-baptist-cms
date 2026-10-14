"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

const inputCls = "w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold";

/** Prayer-request form. Requests are saved privately and appear only in Admin -> Prayer Requests. */
export default function PrayerForm() {
  const [form, setForm] = useState({ name: "", email: "", request: "", website: "" }); // `website` = hidden spam trap
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "PRAYER", name: form.name, email: form.email, message: form.request, website: form.website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't send that just now. Please try again.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send that just now. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center" role="status">
        <p className="font-serif text-lg text-navy">Thank you for trusting us with this.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          Your request has gone to church leadership and stays private. We are praying with you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* Spam trap: hidden from people and screen readers; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this empty<input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></label>
      </div>

      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="p-name">
          Name <span className="font-normal text-ink-soft/70">(optional)</span>
        </label>
        <input id="p-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="p-email">
          Email <span className="font-normal text-ink-soft/70">(optional)</span>
        </label>
        <input id="p-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="p-request">Your Prayer Request</label>
        <textarea id="p-request" value={form.request} onChange={(e) => setForm({ ...form, request: e.target.value })} rows={6} className={inputCls} required />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60"
      >
        {status === "sending" && <Loader2 size={14} className="animate-spin" />} {status === "sending" ? "Sending…" : "Submit Request"}
      </button>
    </form>
  );
}
