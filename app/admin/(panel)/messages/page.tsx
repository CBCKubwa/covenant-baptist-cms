import SubmissionList from "@/components/admin/SubmissionList";

export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Messages</h1>
      <p className="text-sm text-ink-soft mb-8">Messages sent through the Contact page. Click one to read it.</p>
      <SubmissionList type="CONTACT" emptyText="No messages yet. Anything sent from the Contact page will appear here." />
    </div>
  );
}
