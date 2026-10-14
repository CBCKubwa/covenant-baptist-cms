import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminPageHeader, { DbError } from "@/components/admin/AdminPageHeader";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

/** Album list. Open an album to add/delete photos; delete here removes the whole album. */
export default async function AdminAlbumsPage() {
  let albums: Awaited<ReturnType<typeof load>> = [];
  let dbError = false;
  try {
    albums = await load();
  } catch (error) {
    console.error("[admin/albums] load failed:", error);
    dbError = true;
  }

  return (
    <div>
      <AdminPageHeader
        title="Photos & Albums"
        description="Create albums, then open one to upload photos or delete individual pictures."
        actionHref="/admin/albums/new"
        actionLabel="New Album"
      />
      {dbError && <DbError />}

      {albums.length === 0 && !dbError ? (
        <div className="bg-white border border-dashed border-navy/20 rounded-md p-10 text-center text-sm text-ink-soft">
          No albums yet. Click &ldquo;New Album&rdquo; to create the first one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albums.map((album) => {
            const cover = album.coverImage || album.photos[0]?.url;
            return (
              <div key={album.id} className="bg-white border border-navy/10 rounded-md overflow-hidden flex flex-col">
                <Link href={`/admin/albums/${album.id}`} className="block aspect-[16/10] bg-navy/5">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs text-ink-soft">No photos yet</span>
                  )}
                </Link>
                <div className="p-4 flex items-start justify-between gap-2">
                  <Link href={`/admin/albums/${album.id}`} className="min-w-0">
                    <div className="text-navy font-medium truncate">{album.title}</div>
                    <div className="text-xs text-ink-soft mt-0.5">
                      {album._count.photos} photo{album._count.photos === 1 ? "" : "s"}
                      {album.date ? ` · ${album.date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}` : ""}
                    </div>
                  </Link>
                  <DeleteButton
                    endpoint={`/api/admin/albums/${album.id}`}
                    itemName={album.title}
                    warning={`This album and all ${album._count.photos} of its photos will be removed.`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function load() {
  return prisma.album.findMany({
    include: { _count: { select: { photos: true } }, photos: { take: 1, orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}
