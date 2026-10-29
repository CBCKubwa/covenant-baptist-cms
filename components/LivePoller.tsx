"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function LivePoller({ isLive, version }: { isLive: boolean; version: string }) {
  const router = useRouter();
  useEffect(() => { async function check() { if (document.hidden) return; try { const res = await fetch("/api/live", { cache: "no-store" }); const data = await res.json(); if (data.isLive !== isLive || data.version !== version) router.refresh(); } catch { /* retry next poll */ } } const id = setInterval(check, 20000); return () => clearInterval(id); }, [isLive, version, router]);
  return null;
}
