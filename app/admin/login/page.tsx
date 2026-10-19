import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, resolveLogo } from "@/lib/settings";
import { resolveIdentity } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/** Admin sign-in screen. Server part: skip it if already signed in, and load the logo. */
export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const settings = await getSiteSettings();
  const identity = resolveIdentity(settings);
  return <LoginForm logoUrl={resolveLogo(settings)} churchName={identity.name} churchLocation={identity.location} />;
}
