import MenuFooterForm, { type MenuItemValue } from "@/components/admin/MenuFooterForm";
import { footerDefaults } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";
import { DEFAULT_NAV_LABELS, NAV_LABEL_KEYS, resolveNav } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/** Where each menu item appears, shown as a hint beside its box. */
const WHERE: Record<string, string> = {
  "/": "menu link to the homepage",
  "/about": "menu link to the About page",
  "/teachings": "menu link to the Teachings page",
  "/ministries": "menu link to the Ministries page",
  "/events": "menu link to the Events page",
  "/media": "menu link to the Media page",
  "/resources": "menu link to the Resources page",
  "/contact": "menu link to the Contact page",
  cta: "gold button at the top right (and in the mobile menu)",
  prayer: "link in the footer",
};

export default async function AdminMenuFooterPage() {
  const settings = await getSiteSettings();
  const live = resolveNav(settings);
  const liveLabels: Record<string, string> = {
    ...Object.fromEntries(live.items.map((i) => [i.href, i.label])),
    cta: live.ctaLabel,
    prayer: live.prayerLabel,
  };

  const items: MenuItemValue[] = NAV_LABEL_KEYS.map((key) => ({
    key,
    where: WHERE[key] ?? "menu",
    defaultLabel: DEFAULT_NAV_LABELS[key],
    label: liveLabels[key],
  }));

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Menu &amp; Footer</h1>
      <p className="text-sm text-ink-soft mb-8 max-w-[60ch]">
        Rename the menu items at the top of the website and change the copyright line at the bottom.
      </p>
      <MenuFooterForm items={items} copyright={settings?.copyrightText ?? ""} defaultCopyright={footerDefaults.copyright} />
    </div>
  );
}
