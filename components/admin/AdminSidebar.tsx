"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; href: string | null };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "Content",
    items: [
      { label: "Sermons", href: "/admin/sermons" },
      { label: "Daily Word", href: "/admin/daily-word" },
      { label: "Events", href: "/admin/events" },
      { label: "Articles", href: "/admin/articles" },
      { label: "Ministries", href: "/admin/ministries" },
      { label: "Pages", href: "/admin/pages" },
    ],
  },
  {
    label: "Media",
    items: [
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
    items: [{ label: "Church Info", href: "/admin/settings" }],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-[220px] shrink-0 bg-midnight text-parchment/70 p-5">
      <Link href="/admin" className="flex items-center gap-2.5 mb-6">
        <img 
          src="/cbc-logo.png" 
          alt="Covenant Baptist Church Logo" 
          className="w-8 h-8 object-contain shrink-0" 
        />
        <span className="text-[13px] font-semibold text-parchment">Admin</span>
      </Link>
      {GROUPS.map((group) => (
        <div key={group.label} className="mb-5">
          <div className="text-[10px] tracking-[0.14em] uppercase text-parchment/35 mb-1.5">{group.label}</div>
          {group.items.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-2.5 py-2 rounded-md text-[13px] mb-0.5 ${
                  pathname === item.href ? "bg-gold/15 text-gold-light font-semibold" : "hover:text-parchment"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="flex items-center justify-between px-2.5 py-2 text-[13px] text-parchment/35 mb-0.5"
              >
                <span>{item.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-parchment/20">Soon</span>
              </div>
            )
          )}
        </div>
      ))}
      <Link
        href="/"
        className="block mt-6 pt-4 border-t border-parchment/10 text-[12px] text-parchment/50 hover:text-parchment"
      >
        &larr; Back to site
      </Link>
    </aside>
  );
}