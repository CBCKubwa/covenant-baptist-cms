import AlbumForm from "@/components/admin/AlbumForm";

export default function NewAlbumPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Album</h1>
      <p className="text-sm text-ink-soft mb-8">Give it a title, click Create. Once live, this becomes real.</p>
      <AlbumForm />
    </div>
  );
}
