import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, resolveLogo } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { resolveIdentity } from "@/lib/site-content";

/**
 * Shell for every signed-in admin screen. The session is checked here as well as
 * in proxy.ts, so these pages stay private even if the proxy is ever changed.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getSiteSettings();

  // Unread badges in the sidebar. A database hiccup just means no badges.
  let unread: Record<string, number> = {};
  try {
    const [messages, prayers] = await Promise.all([
      prisma.formSubmission.count({ where: { type: "CONTACT", status: "UNREAD" } }),
      prisma.formSubmission.count({ where: { type: "PRAYER", status: "UNREAD" } }),
    ]);
    unread = { "/admin/messages": messages, "/admin/prayer-requests": prayers };
  } catch {
    /* ignore */
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF7]">
      <AdminSidebar logoUrl={resolveLogo(settings)} userName={session.user.name ?? "Admin"} churchName={resolveIdentity(settings).name} unread={unread} />
      <main className="flex-1 min-w-0 p-6 md:p-10">{children}</main>
    </div>
  );
}
