/**
 * "Admin's value, or else the built-in default" for the parts of the public site the
 * admin can edit. Pure functions only (no database, no React), so they are easy to test
 * and safe to use from any server component.
 */
import type { SiteSettings } from "@prisma/client";
import { church, footerDefaults, heroDefaults, menuDefaults, nav, pastorDefaults } from "@/lib/content";

// ------------------------------ church name ------------------------------

/** The church name and location line shown beside the logo (header, footer, login, admin). */
export function resolveIdentity(settings: { churchName?: string | null; churchLocation?: string | null } | null) {
  return {
    name: settings?.churchName?.trim() || church.name,
    location: settings?.churchLocation?.trim() || church.location,
  };
}

/** Split a name so the LAST word drops to a second line ("Covenant Baptist" / "Church"), as the footer design does. */
export function splitLastWord(name: string): [string, string | null] {
  const trimmed = name.trim();
  const i = trimmed.lastIndexOf(" ");
  return i === -1 ? [trimmed, null] : [trimmed.slice(0, i), trimmed.slice(i + 1)];
}

// ------------------------------ menu labels ------------------------------

/** Longest label an admin can give a menu item. */
export const MAX_LABEL_LENGTH = 30;

/** Keys the menu-label override map may contain: each menu link, the header button ("cta"), the footer prayer link ("prayer"). */
export const NAV_LABEL_KEYS: string[] = [...nav.map((n) => n.href), "cta", "prayer"];

/** The built-in label for every key above. */
export const DEFAULT_NAV_LABELS: Record<string, string> = {
  ...Object.fromEntries(nav.map((n) => [n.href, n.label])),
  cta: menuDefaults.ctaLabel,
  prayer: menuDefaults.prayerLabel,
};

/** Read stored overrides defensively (the column is free-form JSON). */
function readNavLabels(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const key of NAV_LABEL_KEYS) {
    const v = (value as Record<string, unknown>)[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim().slice(0, MAX_LABEL_LENGTH);
  }
  return out;
}

/**
 * Validate the label map sent by the admin form. Unknown keys are ignored, blank labels and
 * labels identical to the default are dropped (= "use the default"), over-long labels are rejected.
 */
export function parseNavLabels(value: unknown): { labels: Record<string, string> } | { error: string } {
  if (value == null) return { labels: {} };
  if (typeof value !== "object" || Array.isArray(value)) return { error: "Invalid menu labels." };

  const labels: Record<string, string> = {};
  for (const key of NAV_LABEL_KEYS) {
    const raw = (value as Record<string, unknown>)[key];
    if (typeof raw !== "string") continue;
    // Collapse whitespace and drop control characters.
    const label = raw.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
    if (!label || label === DEFAULT_NAV_LABELS[key]) continue;
    if (label.length > MAX_LABEL_LENGTH) {
      return { error: `Menu labels must be ${MAX_LABEL_LENGTH} characters or fewer ("${label.slice(0, 20)}…" is too long).` };
    }
    labels[key] = label;
  }
  return { labels };
}

/** Menu items for the header and footer, with the admin's labels applied (links never change). */
export function resolveNav(settings: Pick<SiteSettings, "navLabels"> | null) {
  const overrides = readNavLabels(settings?.navLabels);
  return {
    items: nav.map((item) => ({ href: item.href, label: overrides[item.href] || item.label })),
    ctaLabel: overrides.cta || menuDefaults.ctaLabel,
    prayerLabel: overrides.prayer || menuDefaults.prayerLabel,
  };
}

// ------------------------------ homepage banner ------------------------------

type HeroSettings = Pick<
  SiteSettings,
  "heroTitle" | "heroTagline" | "heroSubtitle" | "heroPrimaryLabel" | "heroSecondaryLabel" | "heroImageUrl"
> &
  Partial<Pick<SiteSettings, "churchName" | "churchLocation">>;

export function resolveHero(settings: HeroSettings | null) {
  // Unless the admin wrote their own, the banner headline / line follow the church name / location.
  const identity = resolveIdentity(settings);
  return {
    title: settings?.heroTitle || identity.name,
    tagline: settings?.heroTagline || identity.location,
    subtitle: settings?.heroSubtitle || heroDefaults.subtitle,
    primaryLabel: settings?.heroPrimaryLabel || heroDefaults.primaryLabel,
    secondaryLabel: settings?.heroSecondaryLabel || heroDefaults.secondaryLabel,
    imageSrc: settings?.heroImageUrl || heroDefaults.image,
    /** true when the admin uploaded their own picture (the bundled one is cropped toward the sign). */
    customImage: !!settings?.heroImageUrl,
  };
}

// ------------------------------ pastor ------------------------------

export function resolvePastor(settings: Pick<SiteSettings, "pastorName" | "pastorTitle" | "pastorPhotoUrl"> | null) {
  return {
    name: settings?.pastorName || pastorDefaults.name,
    title: settings?.pastorTitle || pastorDefaults.title || null,
    photo: settings?.pastorPhotoUrl || pastorDefaults.photo,
  };
}

// ------------------------------ footer ------------------------------

/**
 * The footer copyright line. Placeholders are filled in automatically:
 * {year} = current year, {name} = church name, {location} = location line.
 */
export function resolveCopyright(
  settings: (Pick<SiteSettings, "copyrightText"> & Partial<Pick<SiteSettings, "churchName" | "churchLocation">>) | null,
  now: Date = new Date()
): string {
  const identity = resolveIdentity(settings);
  const text = settings?.copyrightText || footerDefaults.copyright;
  return text
    .split("{year}").join(String(now.getFullYear()))
    .split("{name}").join(identity.name)
    .split("{location}").join(identity.location);
}

// ------------------------------ search-engine titles & descriptions ------------------------------

export const MAX_SEO_TITLE = 120;
export const MAX_SEO_DESCRIPTION = 320;

/** The pages whose search-engine text the admin can edit. ("/" is the homepage.) */
export const SEO_PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/visit", label: "Plan Your Visit" },
  { path: "/teachings", label: "Teachings" },
  { path: "/ministries", label: "Ministries" },
  { path: "/events", label: "Events" },
  { path: "/media", label: "Media" },
  { path: "/resources", label: "Resources" },
  { path: "/contact", label: "Contact" },
  { path: "/prayer", label: "Prayer Requests" },
];

type Identity = { name: string; location: string };

/** Built-in description for each page (follows the church name / location). */
function defaultDescription(path: string, { name, location }: Identity): string {
  switch (path) {
    case "/":
      return `${name}, ${location} \u2014 a people called to know Christ deeply, live in the power of His resurrection, and share in the fellowship of His sufferings.`;
    case "/about":
      return `The story, vision, mission, and leadership of ${name}, ${location}.`;
    case "/visit":
      return `Everything you need to know before visiting ${name}, ${location}.`;
    case "/teachings":
      return `Browse sermons from ${name} by speaker, scripture, category, and year.`;
    case "/ministries":
      return `Ministries and ways to get involved at ${name}, ${location}.`;
    case "/events":
      return `Upcoming events at ${name}, ${location}.`;
    case "/media":
      return `Photos, videos, and audio from ${name}, ${location}.`;
    case "/resources":
      return `Articles and devotional content from ${name}, ${location}.`;
    case "/contact":
      return `Get in touch with ${name}, ${location}.`;
    case "/prayer":
      return `Share a prayer request with ${name}, ${location}.`;
    default:
      return `${name}, ${location}.`;
  }
}

/** The title Google would show by default, e.g. "About | Covenant Baptist Church" (homepage: "Name | Location"). */
export function defaultSeoTitle(path: string, { name, location }: Identity): string {
  if (path === "/") return `${name} | ${location}`;
  const label = SEO_PAGES.find((p) => p.path === path)?.label ?? "Page";
  return `${label} | ${name}`;
}

/** Defensive read of the stored JSON: { "/about": { title, description } }. */
function readSeo(value: unknown): Record<string, { title?: string; description?: string }> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, { title?: string; description?: string }> = {};
  for (const { path } of SEO_PAGES) {
    const entry = (value as Record<string, unknown>)[path];
    if (!entry || typeof entry !== "object") continue;
    const { title, description } = entry as Record<string, unknown>;
    out[path] = {
      title: typeof title === "string" && title.trim() ? title.trim().slice(0, MAX_SEO_TITLE) : undefined,
      description: typeof description === "string" && description.trim() ? description.trim().slice(0, MAX_SEO_DESCRIPTION) : undefined,
    };
  }
  return out;
}

/**
 * The search-engine title and description for a page: the admin's text if they wrote any,
 * otherwise the built-in default.
 *  - `title` is the complete title as people will see it.
 *  - `shortTitle` is just the page name, for Next.js to append " | Church Name" to.
 *  - `titleIsCustom` = the admin typed their own title, which must be used exactly as typed.
 */
export function resolveSeo(settings: Pick<SiteSettings, "seo" | "churchName" | "churchLocation"> | null, path: string) {
  const identity = resolveIdentity(settings);
  const custom = readSeo(settings?.seo)[path];
  return {
    title: custom?.title || defaultSeoTitle(path, identity),
    shortTitle: SEO_PAGES.find((p) => p.path === path)?.label ?? "Page",
    titleIsCustom: !!custom?.title,
    description: custom?.description || defaultDescription(path, identity),
  };
}

/** Built-in defaults, for showing as placeholders in the admin form. */
export function seoDefaultsFor(identity: Identity) {
  return SEO_PAGES.map(({ path, label }) => ({
    path,
    label,
    title: defaultSeoTitle(path, identity),
    description: defaultDescription(path, identity),
  }));
}

/**
 * Validate the SEO map sent by the admin form. Unknown pages are ignored, blank entries mean
 * "use the built-in text", and over-long text is rejected so the admin sees why.
 */
export function parseSeo(
  value: unknown
): { seo: Record<string, { title?: string; description?: string }> } | { error: string } {
  if (value == null) return { seo: {} };
  if (typeof value !== "object" || Array.isArray(value)) return { error: "Invalid search-engine text." };

  const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim() : "");
  const seo: Record<string, { title?: string; description?: string }> = {};

  for (const { path, label } of SEO_PAGES) {
    const raw = (value as Record<string, unknown>)[path];
    if (!raw || typeof raw !== "object") continue;
    const title = clean((raw as Record<string, unknown>).title);
    const description = clean((raw as Record<string, unknown>).description);
    if (title.length > MAX_SEO_TITLE) return { error: `The title for "${label}" is too long (maximum ${MAX_SEO_TITLE} characters).` };
    if (description.length > MAX_SEO_DESCRIPTION) return { error: `The description for "${label}" is too long (maximum ${MAX_SEO_DESCRIPTION} characters).` };
    if (title || description) seo[path] = { ...(title ? { title } : {}), ...(description ? { description } : {}) };
  }
  return { seo };
}

/** Church name must never be saved as empty (the database column is required): blank = built-in name. */
export function withRequiredDefaults(data: Record<string, string | null>): Record<string, string | null> {
  if ("churchName" in data && !data.churchName) return { ...data, churchName: church.name };
  return data;
}
