import AlbumForm from "@/components/admin/AlbumForm";

export default function NewAlbumPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Album</h1>
      <p className="text-sm text-ink-soft mb-8">Name the album, then you&rsquo;ll be taken straight to it to upload photos.</p>
      <AlbumForm />
    </div>
  );
}
