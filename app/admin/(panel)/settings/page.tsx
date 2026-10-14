import SettingsForm from "@/components/admin/SettingsForm";
import LogoManager from "@/components/admin/LogoManager";
import { church } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="font-serif text-2xl text-navy mb-2">Church Info &amp; Logo</h1>
        <p className="text-sm text-ink-soft max-w-[60ch]">
          Change the church logo and contact details here. The logo updates the website header, footer, admin and
          login page; the address and phone numbers update the website footer.
        </p>
      </div>

      <LogoManager currentLogo={settings?.logoUrl ?? null} />

      <SettingsForm
        initial={{
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
