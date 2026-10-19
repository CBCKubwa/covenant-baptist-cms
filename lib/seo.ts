import "server-only";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { resolveSeo } from "@/lib/site-content";

/**
 * Search-engine title + description (and the preview shown when a page is shared on
 * WhatsApp / Facebook) for one public page. Uses the admin's text from
 * Admin -> Search Appearance, otherwise the built-in default.
 *
 * Usage in a page file:   export const generateMetadata = () => pageMetadata("/about");
 */
export async function pageMetadata(path: string): Promise<Metadata> {
  const seo = resolveSeo(await getSiteSettings(), path);
  return {
    // A title the admin typed is used EXACTLY as typed (`absolute` skips the automatic
    // " | Church Name" suffix); otherwise only the page name is given and the suffix is added once.
    title: seo.titleIsCustom ? { absolute: seo.title } : seo.shortTitle,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, type: "website" },
  };
}
