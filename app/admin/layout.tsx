import type { Metadata } from "next";

// Applies to every /admin page (including the login screen): keep them out of Google.
export const metadata: Metadata = {
  title: "Admin | Covenant Baptist Church",
  robots: { index: false, follow: false },
};

/**
 * Deliberately minimal. The sidebar lives in app/admin/(panel)/layout.tsx so that
 * the login page (which sits outside that route group) is full-screen and
 * does not show the admin navigation to signed-out visitors.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
