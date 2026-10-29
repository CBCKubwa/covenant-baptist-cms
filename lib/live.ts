import { getYouTubeEmbedUrl } from "@/lib/media";

export type VideoEmbed = { provider: "youtube" | "facebook"; embedUrl: string };
const FACEBOOK_HOSTS = new Set(["facebook.com", "m.facebook.com", "web.facebook.com", "www.facebook.com"]);

/** Convert supported YouTube or public Facebook URLs into safe embedded-player URLs. */
export function getVideoEmbed(value: string | null | undefined): VideoEmbed | null {
  if (!value) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
    const channel = url.pathname.startsWith("/channel/") ? url.pathname.split("/")[2] : url.searchParams.get("channel");
    if (channel && /^UC[\w-]{20,30}$/.test(channel)) {
      return { provider: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/live_stream?channel=${encodeURIComponent(channel)}&rel=0` };
    }
    const embed = getYouTubeEmbedUrl(value);
    return embed ? { provider: "youtube", embedUrl: `${embed}?rel=0` } : null;
  }
  if (FACEBOOK_HOSTS.has(host)) {
    return { provider: "facebook", embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=false&width=1280` };
  }
  return null;
}

export const EMBED_ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
