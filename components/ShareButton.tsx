"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, Link2, Mail, MessageCircle, Send, Share2, X } from "lucide-react";

type Props = { url: string; title: string; message?: string; tone?: "light" | "dark"; size?: "sm" | "md"; label?: string };
async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    try { const box = document.createElement("textarea"); box.value = text; box.setAttribute("readonly", ""); box.style.position = "fixed"; box.style.opacity = "0"; document.body.appendChild(box); box.select(); box.setSelectionRange(0, text.length); const ok = document.execCommand("copy"); document.body.removeChild(box); return ok; } catch { return false; }
  }
}

export default function ShareButton({ url, title, message, tone = "light", size = "md", label = "Share" }: Props) {
  const [open, setOpen] = useState(false); const [shareUrl, setShareUrl] = useState(""); const [copied, setCopied] = useState<"yes" | "failed" | null>(null); const [canNativeShare, setCanNativeShare] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null); const dialogRef = useRef<HTMLDivElement>(null); const inputRef = useRef<HTMLInputElement>(null); const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined); const headingId = useId();
  const lead = message ? `${title} — ${message}` : title;
  function openPanel() { setShareUrl(new URL(url, window.location.origin).toString()); setCanNativeShare(typeof navigator.share === "function"); setCopied(null); setOpen(true); }
  function closePanel() { setOpen(false); triggerRef.current?.focus(); }
  useEffect(() => { if (!open) return; const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePanel(); }; document.addEventListener("keydown", onKey); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; dialogRef.current?.focus(); return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = previous; }; }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function handleCopy() { const ok = await copyText(shareUrl); if (!ok) inputRef.current?.select(); setCopied(ok ? "yes" : "failed"); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(null), 3000); }
  async function handleNativeShare() { try { await navigator.share({ title, text: lead, url: shareUrl }); setOpen(false); } catch { /* user cancelled */ } }
  const enc = encodeURIComponent;
  const options: { label: string; href: string; color: string; icon: ReactNode; external?: boolean }[] = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${lead}
${shareUrl}`)}`, color: "#25D366", icon: <MessageCircle size={20} />, external: true },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`, color: "#1877F2", icon: <span className="font-bold text-lg leading-none">f</span>, external: true },
    { label: "Telegram", href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(lead)}`, color: "#229ED9", icon: <Send size={18} />, external: true },
    { label: "X", href: `https://x.com/intent/tweet?text=${enc(lead)}&url=${enc(shareUrl)}`, color: "#111111", icon: <span className="font-bold text-base leading-none">X</span>, external: true },
    { label: "Email", href: `mailto:?subject=${enc(title)}&body=${enc(`${lead}

${shareUrl}`)}`, color: "#56607A", icon: <Mail size={19} /> },
  ];
  const triggerStyle = tone === "dark" ? "border-parchment/30 text-parchment hover:border-gold hover:text-gold-light" : "border-navy/20 text-navy hover:border-gold hover:bg-parchment/60";
  const triggerSize = size === "sm" ? "px-3 py-1.5 text-xs gap-1.5" : "px-4 py-2.5 text-sm gap-2";
  return <>
    <button ref={triggerRef} type="button" onClick={openPanel} aria-haspopup="dialog" className={`inline-flex items-center rounded-md border font-semibold transition active:scale-95 ${triggerStyle} ${triggerSize}`}><Share2 size={size === "sm" ? 14 : 16} /> {label}</button>
    {open && typeof document !== "undefined" && createPortal(<div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={closePanel} className="absolute inset-0 bg-midnight/70" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={headingId} tabIndex={-1} className="relative w-full sm:max-w-[420px] bg-white text-ink rounded-t-2xl sm:rounded-xl p-6 shadow-2xl outline-none">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 id={headingId} className="font-serif text-lg text-navy">Share</h2><p className="text-[13px] text-ink-soft mt-0.5 line-clamp-2">{title}</p></div><button type="button" onClick={closePanel} aria-label="Close" className="text-ink-soft hover:text-navy shrink-0"><X size={20} /></button></div>
        <div className="mt-5 flex gap-2"><input ref={inputRef} readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} aria-label="Link to share" className="min-w-0 flex-1 rounded-md border border-navy/15 bg-parchment/40 px-3 py-2.5 text-[13px] text-ink" /><button type="button" onClick={handleCopy} className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-navy px-4 py-2.5 text-[13px] font-semibold text-parchment hover:bg-midnight transition active:scale-95">{copied === "yes" ? <Check size={15} /> : <Link2 size={15} />}{copied === "yes" ? "Copied" : "Copy link"}</button></div>
        <p aria-live="polite" className="mt-2 min-h-[18px] text-xs text-ink-soft">{copied === "yes" && "Link copied. Paste it anywhere you like."}{copied === "failed" && "Could not copy automatically. The link is selected: press and hold to copy it."}</p>
        <div className="mt-3 grid grid-cols-5 gap-2">{options.map((o) => <a key={o.label} href={o.href} {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex flex-col items-center gap-1.5 rounded-lg p-1.5 text-[11px] font-medium text-navy hover:bg-parchment/70 transition"><span className="flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ background: o.color }}>{o.icon}</span>{o.label}</a>)}</div>
        {canNativeShare && <button type="button" onClick={handleNativeShare} className="mt-4 w-full rounded-md border border-navy/15 py-2.5 text-[13px] font-semibold text-navy hover:border-gold transition">More apps…</button>}
      </div></div>, document.body)}
  </>;
}
