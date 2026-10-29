import { prisma } from "@/lib/prisma";
import AdminPageHeader, { DbError } from "@/components/admin/AdminPageHeader";
import LiveStreamForm from "@/components/admin/LiveStreamForm";
export const dynamic = "force-dynamic";
export default async function AdminLivePage() {
  let live: Awaited<ReturnType<typeof load>> = null; let dbError = false;
  try { live = await load(); } catch (error) { console.error("[admin/live] load failed:", error); dbError = true; }
  return <div><AdminPageHeader title="Live Stream" description="Start and stop the live broadcast shown on the website's Live page. Anyone visiting the website sees a red ‘Live now’ button while you are on air." />{dbError && <DbError />}<LiveStreamForm initial={{ title: live?.title ?? "Sunday Service", description: live?.description ?? "", streamUrl: live?.streamUrl ?? "", scheduledFor: live?.scheduledFor?.toISOString() ?? "", isLive: live?.isLive ?? false }} /></div>;
}
function load() { return prisma.liveStream.findUnique({ where: { id: "singleton" } }); }
