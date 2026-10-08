import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Look for NextAuth session tokens in cookies
  // Supports both HTTP and HTTPS cookie names
  const sessionToken =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  const isLoginPage = pathname === '/admin/login';

  // 1. Not logged in → send to login
  if (!sessionToken && !isLoginPage) {
    return NextResponse.redirect(
      new URL('/admin/login', req.url)
    );
  }

  // 2. Already logged in → don't allow login page
  if (sessionToken && isLoginPage) {
    return NextResponse.redirect(
      new URL('/admin', req.url)
    );
  }

  // 3. Allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};