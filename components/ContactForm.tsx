"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-parchment rounded-md p-8 text-center">
        <p className="font-serif text-lg text-navy">Thank you{form.name ? `, ${form.name}` : ""}.</p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          This form isn&rsquo;t connected to anything yet &mdash; that arrives with the database in Phase 3. For now,
          the fastest way to reach us is WhatsApp.
        </p>
        <a
          href="https://wa.me/2347031375406"
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
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
          required
        />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
          required
        />
      </div>
      <div>
        <label className="block text-[11.5px] font-semibold text-ink-soft mb-1.5" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          className="w-full border border-navy/15 rounded-md px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
          required
        />
      </div>
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Send Message
      </button>
    </form>
  );
}
