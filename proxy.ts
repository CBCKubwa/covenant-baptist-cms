import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Gatekeeper for everything under /admin and /api/admin.
 *
 * SECURITY FIX: the old version only checked that *a cookie with the right name
 * existed*, so anyone could type a fake cookie and walk in. `getToken` actually
 * verifies the JWT signature with NEXTAUTH_SECRET.
 *
 * (Every admin API route ALSO checks the session itself - defence in depth.)
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoginPage = pathname === "/admin/login";
  const isApi = pathname.startsWith("/api/");

  // Not signed in
  if (!token) {
    if (isApi) return NextResponse.json({ error: "You must be signed in as an admin." }, { status: 401 });
    if (isLoginPage) return NextResponse.next();

    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already signed in: no reason to see the login page again
  if (isLoginPage) return NextResponse.redirect(new URL("/admin", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
