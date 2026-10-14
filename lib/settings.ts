import "server-only";
import { cache } from "react";
import type { SiteSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
