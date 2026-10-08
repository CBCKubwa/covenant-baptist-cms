import PagesForm from "@/components/admin/PagesForm";

export default function AdminPagesPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Pages</h1>
      <p className="text-sm text-ink-soft mb-8">
        The key editable text blocks on the site&rsquo;s core pages &mdash; these are the real values currently
        live, pulled from the same place the pages themselves read from.
      </p>
      <PagesForm />
    </div>
  );
}
