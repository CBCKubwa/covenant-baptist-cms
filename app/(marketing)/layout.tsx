import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { getSiteSettings, resolveLogo } from "@/lib/settings";

// Pages are cached for a minute and instantly refreshed whenever the admin
// saves or deletes something (the admin APIs call revalidatePath).
export const revalidate = 60;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Logo + contact details are editable from Admin -> Church Info.
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[1000] focus:bg-gold focus:text-navy focus:px-4 focus:py-3 focus:font-bold"
      >
        Skip to content
      </a>
      <SiteHeader logoUrl={resolveLogo(settings)} />
      <main id="main">{children}</main>
      <Footer
        logoUrl={resolveLogo(settings)}
        address={settings?.address}
        phone={settings?.phone}
        whatsapp={settings?.whatsapp}
      />
    </>
  );
}
