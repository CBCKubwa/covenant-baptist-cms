import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MinistryForm from "@/components/admin/MinistryForm";
import { parseSections } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function EditMinistryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ministry = await prisma.ministry.findUnique({ where: { id } }).catch(() => null);
  if (!ministry) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">Edit Ministry</h1>
      <p className="text-sm text-ink-soft mb-8">Changes go live as soon as you save.</p>
      <MinistryForm
        initial={{
          id: ministry.id,
          name: ministry.name,
          blurb: ministry.blurb ?? "",
          order: ministry.order,
          image: ministry.image,
          sections: parseSections(ministry.sections).map((s) => ({
            heading: s.heading,
            body: Array.isArray(s.body) ? s.body.join("\n") : s.body,
            list: Array.isArray(s.body),
          })),
        }}
      />
    </div>
  );
}
