"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

type Item = { label: string; href: string };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "Content",
    items: [
      { label: "Sermons", href: "/admin/sermons" },
      { label: "Weekly Word", href: "/admin/weekly-word" },
      { label: "Events", href: "/admin/events" },
      { label: "Articles", href: "/admin/articles" },
      { label: "Ministries", href: "/admin/ministries" },
      { label: "Pages", href: "/admin/pages" },
    ],
  },
  {
    label: "Media",
    items: [
           { label: "Live Stream", href: "/admin/live" },
      { label: "Photos & Albums", href: "/admin/albums" },
      { label: "Video & Audio", href: "/admin/video-audio" },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Prayer Requests", href: "/admin/prayer-requests" },
      { label: "Messages", href: "/admin/messages" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Church Info & Logo", href: "/admin/settings" },
      { label: "Menu & Footer", href: "/admin/menu-footer" },
      { label: "Search Appearance", href: "/admin/search-appearance" },
    ],
  },
];

export default function AdminSidebar({
  logoUrl,
  userName,
  churchName,
  unread = {},
}: {
  logoUrl: string;
  userName: string;
  /** Shown under the logo, so the admin matches the website. */
  churchName: string;
  /** Unread counts keyed by link href, e.g. { "/admin/messages": 3 } */
  unread?: Record<string, number>;
}) {
  const pathname = usePathname() ?? ""; // safe fallback: never crash if the path is unavailable

  // Highlight a section for its list page AND its sub-pages (e.g. /admin/albums/123).
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-full md:w-[240px] shrink-0 bg-midnight text-parchment/70 p-5 md:sticky md:top-0 md:h-screen md:overflow-y-auto flex flex-col">
      <Link href="/admin" className="flex items-center gap-3 mb-7">
        <SiteLogo src={logoUrl} size={40} className="shrink-0" alt={`${churchName} logo`} />
        <span className="leading-tight min-w-0">
          <span className="block text-[13px] font-semibold text-parchment">{churchName}</span>
          <span className="block text-[11px] text-gold-light/80">Admin Portal</span>
        </span>
      </Link>

      <Link
        href="/admin"
        className={`block px-2.5 py-2 rounded-md text-[13px] mb-5 ${
          pathname === "/admin" ? "bg-gold/15 text-gold-light font-semibold" : "hover:text-parchment"
        }`}
      >
        Dashboard
      </Link>

      <div className="flex-1">
        {GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="text-[10px] tracking-[0.14em] uppercase text-parchment/35 mb-1.5">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-2.5 py-2 rounded-md text-[13px] mb-0.5 ${
                  isActive(item.href) ? "bg-gold/15 text-gold-light font-semibold" : "hover:text-parchment"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  {item.label}
                  {unread[item.href] > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-gold text-midnight text-[11px] font-bold flex items-center justify-center" aria-label={`${unread[item.href]} unread`}>
                      {unread[item.href]}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-parchment/10">
        <Link href="/" className="block text-[12px] text-parchment/50 hover:text-parchment mb-3">
          &larr; View live website
        </Link>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-parchment/60 truncate">Signed in as {userName}</span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="inline-flex items-center gap-1.5 text-[12px] text-parchment/70 hover:text-gold-light shrink-0"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
