import { ShieldCheck } from "lucide-react";

export default function AdminPrayerRequestsPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Prayer Requests</h1>
      <p className="text-sm text-ink-soft mb-8">
        Private submissions from the /prayer page &mdash; visible only here, never on the public site.
      </p>
      <div className="bg-white border border-dashed border-navy/20 rounded-md p-10 text-center">
        <ShieldCheck size={26} className="mx-auto text-gold mb-4" />
        <p className="text-ink-soft text-sm max-w-[40ch] mx-auto">
          Nothing yet &mdash; there&rsquo;s no database connected, so what people submit on the public form
          doesn&rsquo;t arrive anywhere right now. Once Phase 3 is live, every request lands in this list, private to
          whoever can log in here.
        </p>
      </div>
    </div>
  );
}
