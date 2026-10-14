import PagesForm from "@/components/admin/PagesForm";
import { church, pageContent } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Pages</h1>
      <p className="text-sm text-ink-soft mb-8 max-w-[60ch]">
        Edit the main text on the Home, About and Plan Your Visit pages. Each box starts with what is live now;
        clear a box and save to go back to the original wording.
      </p>
      <PagesForm
        initial={{
          homeIntro: settings?.homeIntro ?? pageContent.homeIntro,
          aboutIntro: settings?.aboutIntro ?? pageContent.aboutIntro,
          visionFull: settings?.visionFull ?? church.visionFull,
          missionStatement: settings?.missionStatement ?? church.missionStatement,
          visitWhatToExpect: settings?.visitWhatToExpect ?? pageContent.visitWhatToExpect,
          serviceTimes: settings?.serviceTimes ?? "",
        }}
      />
    </div>
  );
}
