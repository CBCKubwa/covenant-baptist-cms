"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";

type FormState = {
  churchName: string;
  churchLocation: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  facebook: string;
  youtube: string;
  instagram: string;
};

/** Contact details & social links. `initial` is loaded from the database by the page. */
export default function SettingsForm({ initial }: { initial: FormState }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not save settings.");
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      <h2 className="font-serif text-lg text-navy -mb-1">Church name</h2>
      <FormField label="Church name (shown beside the logo, in the footer, on the login page and in page titles)" value={form.churchName} onChange={update("churchName")} />
      <FormField label="Line under the name (e.g. your area)" value={form.churchLocation} onChange={update("churchLocation")} />

      <h2 className="font-serif text-lg text-navy -mb-1 mt-2">Contact details</h2>
      <FormField label="Address" value={form.address} onChange={update("address")} />
      <FormField label="Phone" value={form.phone} onChange={update("phone")} />
      <FormField label="WhatsApp number (digits only, with country code)" value={form.whatsapp} onChange={update("whatsapp")} placeholder="2347031375406" />
      <FormField label="Email" value={form.email} onChange={update("email")} placeholder="Add your church email" />
      <FormField label="Google Maps link" value={form.googleMapsUrl} onChange={update("googleMapsUrl")} placeholder="Paste a Google Maps link" />
      <FormField label="Facebook page" value={form.facebook} onChange={update("facebook")} placeholder="https://facebook.com/..." />
      <FormField label="YouTube channel" value={form.youtube} onChange={update("youtube")} placeholder="https://youtube.com/..." />
      <FormField label="Instagram" value={form.instagram} onChange={update("instagram")} placeholder="https://instagram.com/..." />

      <button
        type="submit"
        disabled={status === "saving"}
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Save changes"}
      </button>
      {status === "saved" && <p role="status" className="text-xs text-green-700 -mt-2">Saved. The website footer now shows these details.</p>}
      {status === "error" && <p role="alert" className="text-xs text-red-600 -mt-2">{error}</p>}
    </form>
  );
}
