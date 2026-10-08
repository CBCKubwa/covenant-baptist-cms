import SettingsForm from "@/components/admin/SettingsForm";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Church Info</h1>
      <p className="text-sm text-ink-soft mb-8">
        These are the same details currently in the code. Once connected, changing them here updates the live site
        everywhere they appear &mdash; footer, contact page, and visit page included. This is also where the Google
        Maps link, Facebook page, and YouTube channel you asked about will live.
      </p>
      <SettingsForm />
    </div>
  );
}
