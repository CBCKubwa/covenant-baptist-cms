import Link from "next/link";
import { CalendarDays, Film, Images, Mail, Mic, Settings, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DbError } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

/** Admin home: live counts + shortcuts. (Previously showed hard-coded zeros.) */
export default async function AdminDashboard() {
  let counts: { sermons: number; albums: number; photos: number; media: number; events: number; messages: number; prayers: number } | null = null;
  try {
    const [sermons, albums, photos, media, events, messages, prayers] = await Promise.all([
      prisma.sermon.count(),
      prisma.album.count(),
      prisma.photo.count(),
      prisma.mediaItem.count(),
      prisma.event.count({ where: { startsAt: { gte: new Date() } } }),
      prisma.formSubmission.count({ where: { type: "CONTACT", status: "UNREAD" } }),
      prisma.formSubmission.count({ where: { type: "PRAYER", status: "UNREAD" } }),
    ]);
    counts = { sermons, albums, photos, media, events, messages, prayers };
  } catch (error) {
    console.error("[dashboard] counts failed:", error);
  }

  const cards = [
    { label: "Sermons", value: counts?.sermons, href: "/admin/sermons", icon: Mic },
    { label: "Photo albums", value: counts?.albums, sub: counts ? `${counts.photos} photos` : undefined, href: "/admin/albums", icon: Images },
    { label: "Videos & audio", value: counts?.media, href: "/admin/video-audio", icon: Film },
    { label: "Upcoming events", value: counts?.events, href: "/admin/events", icon: CalendarDays },
    { label: "Unread messages", value: counts?.messages, href: "/admin/messages", icon: Mail },
    { label: "Unread prayer requests", value: counts?.prayers, href: "/admin/prayer-requests", icon: ShieldCheck },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy">Dashboard</h1>
      <p className="mt-1.5 mb-8 text-sm text-ink-soft">Welcome to the Covenant Baptist Church content manager.</p>

      {!counts && <DbError />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, sub, href, icon: Icon }) => (
          <Link key={label} href={href} className="group bg-white border border-navy/10 rounded-md p-6 hover:border-gold hover:shadow-sm transition">
            <Icon size={20} className="text-gold mb-4" />
            <div className="font-serif text-3xl text-navy">{value ?? "—"}</div>
            <div className="mt-1 text-sm text-ink-soft">{label}</div>
            {sub && <div className="text-xs text-ink-soft/70">{sub}</div>}
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white border border-navy/10 rounded-md p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-serif text-lg text-navy">Change the church logo</div>
          <p className="text-sm text-ink-soft mt-1">Upload a new logo once and it updates the website, admin and login page.</p>
        </div>
        <Link href="/admin/settings" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-navy/15 text-sm font-semibold text-navy hover:border-gold transition">
          <Settings size={16} /> Open Church Info
        </Link>
      </div>
    </div>
  );
}
