import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Article</h1>
      <p className="text-sm text-ink-soft mb-8">Write it up, click Publish. Once live, this becomes real.</p>
      <ArticleForm />
    </div>
  );
}
