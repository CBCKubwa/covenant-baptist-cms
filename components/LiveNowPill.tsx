"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function LiveNowPill({ initialLive }: { initialLive: boolean }) {
  const pathname = usePathname(); const [live, setLive] = useState(initialLive);
  useEffect(() => setLive(initialLive), [initialLive]);
  useEffect(() => { async function check() { if (document.hidden) return; try { const res = await fetch("/api/live", { cache: "no-store" }); const data = await res.json(); if (typeof data.isLive === "boolean") setLive(data.isLive); } catch { /* retain last known status */ } } const id = setInterval(check, 30000); return () => clearInterval(id); }, []);
  if (!live || pathname === "/live") return null;
  return <Link href="/live" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] inline-flex items-center gap-2.5 rounded-full bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:bg-red-500 transition active:scale-95"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" /></span>Live now · Watch</Link>;
}
