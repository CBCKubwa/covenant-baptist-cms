import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import LiveNowBadge from "@/components/LiveNowBadge";
import { getSiteSettings, resolveContact, resolveLogo } from "@/lib/settings";
import { resolveCopyright, resolveIdentity, resolveNav } from "@/lib/site-content";

// Pages are cached for a minute and instantly refreshed whenever the admin
// saves or deletes something (the admin APIs call revalidatePath).
export const revalidate = 60;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Logo + contact details are editable from Admin -> Church Info.
  const settings = await getSiteSettings();
  const menu = resolveNav(settings); // menu labels (Admin -> Menu & Footer)
  const identity = resolveIdentity(settings); // church name + location line

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[1000] focus:bg-gold focus:text-navy focus:px-4 focus:py-3 focus:font-bold"
      >
        Skip to content
      </a>
      <SiteHeader
        logoUrl={resolveLogo(settings)}
        navItems={menu.items}
        ctaLabel={menu.ctaLabel}
        churchName={identity.name}
        churchLocation={identity.location}
      />
      <main id="main">{children}</main>
      <Footer
        logoUrl={resolveLogo(settings)}
        contact={resolveContact(settings)}
        vision={settings?.visionFull}
        navItems={menu.items}
        prayerLabel={menu.prayerLabel}
        copyright={resolveCopyright(settings)}
        churchName={identity.name}
      />
      <LiveNowBadge />
    </>
  );
}
