"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import FileUploader from "./FileUploader";

type Initial = { id: string; title: string; author: string; category: string; tags: string; content: string; featuredImage: string | null };

/** Create (no `initial`) or edit (`initial` given) an article. */
export default function ArticleForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    author: initial?.author ?? "",
    category: initial?.category ?? "",
    tags: initial?.tags ?? "",
    content: initial?.content ?? "",
  });
  const [image, setImage] = useState<string | null>(initial?.featuredImage ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(initial ? `/api/admin/articles/${initial.id}` : "/api/admin/articles", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, featuredImage: image }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save the article.");
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the article.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-navy/10 rounded-md p-7 grid gap-5 max-w-[680px]">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <FormField label="Title *" value={form.title} onChange={update("title")} required />
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Author" value={form.author} onChange={update("author")} />
        <FormField label="Category" value={form.category} onChange={update("category")} placeholder="e.g. Devotional" />
      </div>
      <FormField label="Tags (comma separated)" value={form.tags} onChange={update("tags")} placeholder="faith, grace, prayer" />
      <FileUploader label="Featured image" kind="image" value={image} onChange={setImage} />
      <div>
        <FormField label="Content *" value={form.content} onChange={update("content")} textarea />
        <p className="mt-1.5 text-xs text-ink-soft">Leave a blank line between paragraphs.</p>
      </div>
      <button type="submit" disabled={saving} className="justify-self-start inline-flex items-center gap-2 px-7 py-3.5 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition disabled:opacity-60">
        {saving && <Loader2 size={14} className="animate-spin" />} {saving ? "Saving…" : initial ? "Save changes" : "Publish article"}
      </button>
    </form>
  );
}
