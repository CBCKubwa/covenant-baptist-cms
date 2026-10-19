import PagesForm from "@/components/admin/PagesForm";
import SettingImageManager from "@/components/admin/SettingImageManager";
import { church, heroDefaults, pageContent, pastorDefaults } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Pages</h1>
      <p className="text-sm text-ink-soft mb-8 max-w-[60ch]">
        Change the pictures and wording on the Home, About and Plan Your Visit pages. Text boxes start with what is live
        now; clear a box and save to go back to the original wording.
      </p>

      <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3">Pictures</span>
      <div className="grid gap-5 mb-10">
        <SettingImageManager
          field="heroImageUrl"
          title="Homepage banner picture"
          help="The large picture behind the headline on the homepage. Use a wide (landscape) photo, at least 1600 px across. A darkening overlay is added automatically so the text stays readable."
          current={settings?.heroImageUrl ?? null}
          fallbackSrc={heroDefaults.image}
          resetLabel="Use original picture"
        />
        <SettingImageManager
          field="pastorPhotoUrl"
          title="Pastor's photo (About page)"
          help="Shown as a circle next to the pastor's name. A clear head-and-shoulders photo, at least 400 × 400 px, works best."
          current={settings?.pastorPhotoUrl ?? null}
          fallbackSrc={pastorDefaults.photo}
          shape="round"
          resetLabel="Use original photo"
        />
        <SettingImageManager
          field="visitImageUrl"
          title="Plan Your Visit photo"
          help="The large picture at the top of the Plan Your Visit page. A wide (landscape) photo works best, at least 1600 px across."
          current={settings?.visitImageUrl ?? null}
          fallbackSrc="/church-building.jpg"
          resetLabel="Use original photo"
        />
      </div>

      <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-3">Wording</span>
      <PagesForm
        initial={{
          heroTitle: settings?.heroTitle ?? heroDefaults.title,
          heroTagline: settings?.heroTagline ?? heroDefaults.tagline,
          heroSubtitle: settings?.heroSubtitle ?? heroDefaults.subtitle,
          heroPrimaryLabel: settings?.heroPrimaryLabel ?? heroDefaults.primaryLabel,
          heroSecondaryLabel: settings?.heroSecondaryLabel ?? heroDefaults.secondaryLabel,
          homeIntro: settings?.homeIntro ?? pageContent.homeIntro,
          aboutIntro: settings?.aboutIntro ?? pageContent.aboutIntro,
          visionFull: settings?.visionFull ?? church.visionFull,
          missionStatement: settings?.missionStatement ?? church.missionStatement,
          pastorName: settings?.pastorName ?? pastorDefaults.name,
          pastorTitle: settings?.pastorTitle ?? pastorDefaults.title,
          visitWhatToExpect: settings?.visitWhatToExpect ?? pageContent.visitWhatToExpect,
          serviceTimes: settings?.serviceTimes ?? "",
        }}
      />
    </div>
  );
}
