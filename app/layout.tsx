import type { Metadata } from "next";
import "./globals.css";
import { FAVICON_DEFAULT } from "@/lib/content";
import { getSiteSettings, resolveContact } from "@/lib/settings";
import { resolveIdentity, resolveSeo } from "@/lib/site-content";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Site-wide metadata. Everything here follows the admin's settings:
 *  - the church name in every page title (the "| Church Name" suffix),
 *  - the homepage title + description (Admin -> Search Appearance),
 *  - the browser-tab icon (Admin -> Church Info & Logo).
 * (The old app/icon.jpg file was moved to public/favicon.jpg: a file in /app would ALWAYS win,
 *  so the icon could never be changed from the admin.)
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const identity = resolveIdentity(settings);
  const home = resolveSeo(settings, "/");
  const icon = settings?.faviconUrl || FAVICON_DEFAULT;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: home.title, template: `%s | ${identity.name}` },
    description: home.description,
    openGraph: { title: home.title, description: home.description, type: "website" },
    icons: { icon, apple: icon },
  };
}

/**
 * Hidden "this is a church at this address" data for search engines (Google uses it for the
 * knowledge panel). Built from the same contact details the admin edits, so it never goes stale.
 */
function buildJsonLd(contact: ReturnType<typeof resolveContact>, churchName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    name: churchName,
    address: { "@type": "PostalAddress", streetAddress: contact.address, addressCountry: "NG" },
    telephone: contact.phone,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const jsonLd = buildJsonLd(resolveContact(settings), resolveIdentity(settings).name);
  return (
    <html lang="en">
      <body className="bg-parchment text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
