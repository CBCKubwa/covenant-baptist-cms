import SubmissionList from "@/components/admin/SubmissionList";

export const dynamic = "force-dynamic";

export default function AdminPrayerRequestsPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Prayer Requests</h1>
      <p className="text-sm text-ink-soft mb-8">
        Private requests from the Prayer page &mdash; visible only here, never on the public site.
      </p>
      <SubmissionList type="PRAYER" emptyText="No prayer requests yet. Requests from the Prayer page will appear here, private to anyone signed in to this admin." />
    </div>
  );
}
