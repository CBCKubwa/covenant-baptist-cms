import SettingsForm from "@/components/admin/SettingsForm";
import LogoManager from "@/components/admin/LogoManager";
import SettingImageManager from "@/components/admin/SettingImageManager";
import { church, FAVICON_DEFAULT } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="font-serif text-2xl text-navy mb-2">Church Info &amp; Logo</h1>
        <p className="text-sm text-ink-soft max-w-[60ch]">
          Change the church name, logo, tab icon and contact details here. The name and logo appear in the website header,
          footer, admin and login page; the contact details appear in the footer, Contact page and Plan Your Visit page.
        </p>
      </div>

      <LogoManager currentLogo={settings?.logoUrl ?? null} />

      <SettingImageManager
        field="faviconUrl"
        title="Browser-tab icon"
        help="The tiny icon shown on the browser tab and in bookmarks. Use a square picture, at least 256 × 256 px. Browsers remember tab icons, so a change can take a little while (or a hard refresh) to appear."
        current={settings?.faviconUrl ?? null}
        fallbackSrc={FAVICON_DEFAULT}
        shape="square"
        resetLabel="Use original icon"
      />

      <SettingsForm
        initial={{
          churchName: settings?.churchName ?? church.name,
          churchLocation: settings?.churchLocation ?? church.location,
          address: settings?.address ?? church.address,
          phone: settings?.phone ?? church.phone,
          whatsapp: settings?.whatsapp ?? church.whatsapp,
          email: settings?.email ?? church.email ?? "",
          googleMapsUrl: settings?.googleMapsUrl ?? "",
          facebook: settings?.facebook ?? "",
          youtube: settings?.youtube ?? "",
          instagram: settings?.instagram ?? "",
        }}
      />
    </div>
  );
}
