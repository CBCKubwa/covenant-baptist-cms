import { Mail } from "lucide-react";

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Messages</h1>
      <p className="text-sm text-ink-soft mb-8">Submissions from the Contact page.</p>
      <div className="bg-white border border-dashed border-navy/20 rounded-md p-10 text-center">
        <Mail size={26} className="mx-auto text-gold mb-4" />
        <p className="text-ink-soft text-sm max-w-[40ch] mx-auto">
          Nothing yet, for the same reason as Prayer Requests &mdash; no database, no delivery. Once it&rsquo;s
          connected, every Contact form submission lands here.
        </p>
      </div>
    </div>
  );
}
