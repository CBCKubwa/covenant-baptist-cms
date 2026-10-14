import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AlbumPhotoManager from "@/components/admin/AlbumPhotoManager";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

/** One album: upload more photos, delete individual photos, or delete the whole album. */
export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await prisma.album
    .findUnique({ where: { id }, include: { photos: { orderBy: { order: "asc" } } } })
    .catch(() => null);
  if (!album) notFound();

  return (
    <div>
      <Link href="/admin/albums" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-navy mb-5">
        <ArrowLeft size={14} /> All albums
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl text-navy">{album.title}</h1>
          {album.description && <p className="mt-1.5 text-sm text-ink-soft max-w-[60ch]">{album.description}</p>}
        </div>
        <DeleteButton
          variant="button"
          label="Delete album"
          endpoint={`/api/admin/albums/${album.id}`}
          itemName={album.title}
          warning={`This album and all ${album.photos.length} of its photos will be removed.`}
          redirectTo="/admin/albums"
        />
      </div>

      <AlbumPhotoManager albumId={album.id} photos={album.photos.map((p) => ({ id: p.id, url: p.url, caption: p.caption }))} />
    </div>
  );
}
