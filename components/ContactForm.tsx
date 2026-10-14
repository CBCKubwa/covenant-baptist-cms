"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { church } from "@/lib/content";

const inputCls = "w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold";

/** Contact form. Messages are saved to the database and appear in Admin -> Messages. */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" }); // `website` = hidden spam trap
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
        body: JSON.stringify({ type: "CONTACT", ...form }),
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
      <div className="bg-parchment rounded-md p-8 text-center" role="status">
        <p className="font-serif text-lg text-navy">Thank you{form.name ? `, ${form.name}` : ""}.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          Your message has been received and someone will get back to you. If it&rsquo;s urgent, you can also reach us on WhatsApp.
        </p>
        <a
          href={`https://wa.me/${church.whatsapp}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center mt-5 px-6 py-3 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase"
        >
          Message on WhatsApp
        </a>
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
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="name">Name</label>
        <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} required />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} required />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="message">Message</label>
        <textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className={inputCls} required />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60"
      >
        {status === "sending" && <Loader2 size={14} className="animate-spin" />} {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
