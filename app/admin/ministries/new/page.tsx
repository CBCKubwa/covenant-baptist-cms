import MinistryForm from "@/components/admin/MinistryForm";

export default function NewMinistryPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Ministry</h1>
      <p className="text-sm text-ink-soft mb-8">Add a name, a short blurb, and as many sections as it needs.</p>
      <MinistryForm />
    </div>
  );
}
