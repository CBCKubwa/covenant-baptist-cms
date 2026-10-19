import SearchAppearanceForm, { type SeoRow } from "@/components/admin/SearchAppearanceForm";
import { getSiteSettings } from "@/lib/settings";
import { resolveIdentity, resolveSeo, seoDefaultsFor } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/** Search Appearance: the title + description Google and link previews show for each page. */
export default async function AdminSearchAppearancePage() {
  const settings = await getSiteSettings();
  const defaults = seoDefaultsFor(resolveIdentity(settings));

  const rows: SeoRow[] = defaults.map((d) => {
    const live = resolveSeo(settings, d.path);
    return {
      path: d.path,
      label: d.label,
      defaultTitle: d.title,
      defaultDescription: d.description,
      // Only the admin's OWN text goes in the boxes; empty = built-in (which keeps following the church name).
      title: live.titleIsCustom ? live.title : "",
      description: live.description !== d.description ? live.description : "",
    };
  });

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Search Appearance</h1>
      <p className="text-sm text-ink-soft mb-8 max-w-[62ch]">
        This is the text Google shows for each page of your website, and the preview people see when a link is shared on
        WhatsApp or Facebook. You don&rsquo;t need to change anything &mdash; sensible text is filled in for you from the church
        name. Write your own only if you want to.
      </p>
      <SearchAppearanceForm rows={rows} />
    </div>
  );
}
