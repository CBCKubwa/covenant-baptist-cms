import "server-only";
import { cache } from "react";
import type { SiteSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { church } from "@/lib/content";

/** Logo bundled with the project (public/cbc-logo.png). Used until the admin uploads a new one. */
export const DEFAULT_LOGO = "/cbc-logo.png";

/**
 * Loads the single site-settings row. Returns null (instead of throwing) if the
 * database is unreachable, so the public site still renders with defaults.
 * `cache()` de-duplicates the query within one request.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  } catch (error) {
    console.error("[settings] could not load site settings:", error);
    return null;
  }
});

/** The logo URL to display: the admin's upload if there is one, otherwise the default. */
export function resolveLogo(settings: Pick<SiteSettings, "logoUrl"> | null): string {
  return settings?.logoUrl || DEFAULT_LOGO;
}

/** Only http(s) links are ever rendered as clickable URLs (blocks `javascript:` and friends). */
function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export type ContactDetails = {
  address: string;
  phone: string;
  /** `tel:` link for the phone number */
  phoneHref: string;
  /** WhatsApp number, digits only (for wa.me links) */
  whatsapp: string;
  email: string | null;
  mapsUrl: string;
  social: Array<{ label: string; url: string }>;
};

/**
 * The church's contact details as the PUBLIC site should show them: whatever the admin
 * saved in Church Info, otherwise the built-in defaults. Every public page uses this one
 * function, so an edit in the admin shows up everywhere at once.
 */
export function resolveContact(settings: SiteSettings | null): ContactDetails {
  const address = settings?.address || church.address;
  const phone = settings?.phone || church.phone;
  return {
    address,
    phone,
    phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}`,
    whatsapp: (settings?.whatsapp || church.whatsapp).replace(/\D/g, ""),
    email: settings?.email || church.email || null,
    mapsUrl: safeUrl(settings?.googleMapsUrl) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    social: [
      { label: "Facebook", url: safeUrl(settings?.facebook) },
      { label: "YouTube", url: safeUrl(settings?.youtube) },
      { label: "Instagram", url: safeUrl(settings?.instagram) },
    ].filter((x): x is { label: string; url: string } => !!x.url),
  };
}
