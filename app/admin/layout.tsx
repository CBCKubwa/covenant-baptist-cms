import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin | Covenant Baptist Church",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF7]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-md p-4 text-[13px] text-blue-900 mb-8">
          <ShieldCheck size={18} className="shrink-0 mt-0.5" />
          <span>
            <strong>Password-protected, simply.</strong> This whole area now requires the username and password you
            set as environment variables when you deploy &mdash; visitors can&rsquo;t get in. It&rsquo;s not yet the
            full role-based login screen from the original brief, but it does the one thing that matters now: keeps
            this private.
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
