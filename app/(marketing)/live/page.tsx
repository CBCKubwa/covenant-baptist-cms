import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ShareButton from "@/components/ShareButton";
import LivePoller from "@/components/LivePoller";
import { getLiveStream } from "@/lib/queries";
import { EMBED_ALLOW, getVideoEmbed } from "@/lib/live";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const live = await getLiveStream(); const onAir = !!live?.isLive; const title = onAir ? `LIVE: ${live.title}` : "Watch Live";
  const description = onAir ? "We are live now. Tap to join the service online." : "Join our services online. This page plays our live broadcast whenever we are streaming.";
  return { title, description, alternates: { canonical: "/live" }, openGraph: { title, description, type: "website", url: "/live", images: [{ url: "/church-building.jpg" }] }, twitter: { card: "summary_large_image", title, description, images: ["/church-building.jpg"] } };
}
export default async function LivePage() {
  const live = await getLiveStream(); const embed = live?.isLive ? getVideoEmbed(live.streamUrl) : null; const onAir = !!embed;
  const next = live?.scheduledFor && live.scheduledFor > new Date() ? live.scheduledFor.toLocaleString("en-GB", { timeZone: "Africa/Lagos", weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit", hour12: true }) : null;
  return <><PageHeader eyebrow={onAir ? "● Live now" : "Live"} title={onAir ? live!.title : "Watch Live"} description={onAir ? live!.description ?? undefined : "Join our services online, wherever you are."} /><section className="bg-white py-12 md:py-16 px-6"><div className="max-w-[960px] mx-auto">{onAir ? <><iframe src={embed!.embedUrl} title={live!.title} allow={EMBED_ALLOW} allowFullScreen className="w-full aspect-video rounded-sm bg-black" /><div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-ink-soft">Share this page so others can join the service.</p><ShareButton url="/live" title={`LIVE: ${live!.title}`} message="Join us online now" /></div>{live!.streamUrl && <p className="mt-4 text-xs text-ink-soft">Video not loading? <a href={live!.streamUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-navy">Open the stream in a new tab</a></p>}</> : <div className="border border-dashed border-navy/20 rounded-md px-6 py-16 text-center"><p className="font-serif text-xl text-navy">We are not live right now.</p>{next && <p className="mt-3 text-sm text-ink-soft">Next live broadcast: <strong className="text-navy">{next}</strong> (Nigeria time)</p>}<p className="mt-3 text-sm text-ink-soft max-w-[48ch] mx-auto">Keep this page open: the broadcast will start here automatically. In the meantime you can watch or listen to past messages.</p><div className="mt-7 flex flex-wrap items-center justify-center gap-3"><Link href="/teachings" className="inline-block px-6 py-3 rounded bg-navy text-parchment text-xs font-bold tracking-wide uppercase hover:bg-midnight transition">Watch past sermons</Link><ShareButton url="/live" title="Watch our services live" message="Join us online" /></div></div>}</div></section><LivePoller isLive={onAir} version={live ? String(live.updatedAt.getTime()) : "0"} /></>;
}
