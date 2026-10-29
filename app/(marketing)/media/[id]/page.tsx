import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ShareButton from "@/components/ShareButton";
import { getMediaItemById } from "@/lib/queries";
import { EMBED_ALLOW, getVideoEmbed } from "@/lib/live";
export const revalidate = 60;
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { id } = await params; const item = await getMediaItemById(id); if (!item) return { title: "Media" }; const description = item.description?.replace(/\s+/g, " ").slice(0, 160) || (item.type === "AUDIO" ? "Listen to this audio recording." : "Watch this video."); const path = `/media/${item.id}`; return { title: item.title, description, alternates: { canonical: path }, openGraph: { title: item.title, description, type: "website", url: path, images: [{ url: "/church-building.jpg" }] }, twitter: { card: "summary_large_image", title: item.title, description, images: ["/church-building.jpg"] } }; }
export default async function MediaItemPage({ params }: Props) { const { id } = await params; const item = await getMediaItemById(id); if (!item) notFound(); const isAudio = item.type === "AUDIO"; const embed = getVideoEmbed(item.url); return <><PageHeader eyebrow={isAudio ? "Audio" : "Video"} title={item.title} description={item.description ?? undefined} /><section className="bg-white py-12 md:py-16 px-6"><div className="max-w-[860px] mx-auto"><div className="flex flex-wrap items-center justify-between gap-4 mb-8"><Link href="/media" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-navy"><ArrowLeft size={14} /> All media</Link><ShareButton url={`/media/${item.id}`} title={item.title} /></div>{embed ? <iframe src={embed.embedUrl} title={item.title} allow={EMBED_ALLOW} allowFullScreen className="w-full aspect-video rounded-sm bg-black" /> : isAudio ? <div className="border border-navy/10 rounded-sm p-5"><audio controls preload="metadata" src={item.url} className="w-full" aria-label={`Audio: ${item.title}`} /></div> : <video controls playsInline preload="metadata" src={item.url} className="w-full aspect-video rounded-sm bg-black" />}</div></section></>; }
