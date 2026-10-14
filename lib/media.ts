/**
 * Turn a YouTube watch / share / embed link into a privacy-friendly embed URL.
 * Returns null if the link is not YouTube.
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/") || u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
    }
    return id && /^[\w-]{6,15}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
