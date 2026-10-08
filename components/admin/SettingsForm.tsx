"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import FormField from "./FormField";
import { church } from "@/lib/content";

type FormState = {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  facebook: string;
  youtube: string;
  instagram: string;
};

export default function SettingsForm() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FormState>({
    address: church.address,
    phone: church.phone,
    whatsapp: church.whatsapp,
    email: church.email || "",
    googleMapsUrl: "",
    facebook: "",
    youtube: "",
    instagram: "",
  });

  const update =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed to save settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error(error);
      alert("Could not save church settings. Make sure the database is configured.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[560px]">
      <FormField label="Address" value={form.address} onChange={update("address")} />
      <FormField label="Phone" value={form.phone} onChange={update("phone")} />
      <FormField label="WhatsApp Number" value={form.whatsapp} onChange={update("whatsapp")} />
      <FormField label="Email" value={form.email} onChange={update("email")} placeholder="Add your church email" />
      <FormField
        label="Google Maps Link"
        value={form.googleMapsUrl}
        onChange={update("googleMapsUrl")}
        placeholder="Paste a Google Maps link"
      />
      <FormField
        label="Facebook Page"
        value={form.facebook}
        onChange={update("facebook")}
        placeholder="https://facebook.com/..."
      />
      <FormField
        label="YouTube Channel"
        value={form.youtube}
        onChange={update("youtube")}
        placeholder="https://youtube.com/..."
      />
      <FormField
        label="Instagram"
        value={form.instagram}
        onChange={update("instagram")}
        placeholder="https://instagram.com/..."
      />
      <button
        type="submit"
        className="justify-self-start px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition"
      >
        Save Changes
      </button>
      {saved && (
        <p className="text-xs text-green-700">
          Saved to the church database. These settings can now power the public site.
        </p>
      )}
    </form>
  );
}
