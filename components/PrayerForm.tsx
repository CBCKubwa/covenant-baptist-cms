"use client";

import { useState, type FormEvent } from "react";

export default function PrayerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", request: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center">
        <p className="font-serif text-lg text-navy">Thank you for trusting us with this.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          This form isn&rsquo;t connected to anything yet &mdash; that arrives with the database in Phase 3, at
          which point requests go straight to church leadership and stay private, as promised above.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="p-name">
          Name <span className="font-normal text-ink-soft/70">(optional)</span>
        </label>
        <input
          id="p-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="p-email">
          Email <span className="font-normal text-ink-soft/70">(optional)</span>
        </label>
        <input
          id="p-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="p-request">
          Your Prayer Request
        </label>
        <textarea
          id="p-request"
          value={form.request}
          onChange={(e) => setForm({ ...form, request: e.target.value })}
          rows={6}
          className="w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
          required
        />
      </div>
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Submit Request
      </button>
    </form>
  );
}
