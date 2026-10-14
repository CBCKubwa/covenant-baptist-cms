import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clearHits, getClientIp, isLimited, limiterKey, recordHit } from "@/lib/rate-limit";

/** Login throttling: after this many FAILED attempts, sign-in is blocked for the window. */
const MAX_FAILS_PER_USER = 5; // per IP + username
const MAX_FAILS_PER_IP = 20; // per IP, across all usernames
const LOCK_WINDOW_SECONDS = 15 * 60;

/**
 * A real bcrypt hash of a throw-away string, generated once at start-up. When the
 * username does not exist we still run a bcrypt comparison against it, so
 * "wrong username" and "wrong password" take the same time and attackers
 * cannot discover which usernames exist.
 */
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;
        if (!username || !password) return null;

        // --- Brute-force protection -------------------------------------------
        // Keys are hashed, so no raw IPs or usernames are stored.
        const ip = getClientIp(req?.headers);
        const userKey = limiterKey("login", ip, username.toLowerCase());
        const ipKey = limiterKey("login-ip", ip);
        if ((await isLimited(userKey, MAX_FAILS_PER_USER)) || (await isLimited(ipKey, MAX_FAILS_PER_IP))) {
          // The message arrives in the browser as `error`; the login form shows a friendly text for it.
          throw new Error("RATE_LIMITED");
        }

        let user: { id: string; name: string; role: string } | null = null;
        try {
          const admin = await prisma.admin.findUnique({ where: { username } });
          const isValid = await bcrypt.compare(password, admin?.password ?? DUMMY_HASH);
          if (admin && isValid) user = { id: admin.id, name: admin.username, role: admin.role };
        } catch (error) {
          // Database down / misconfigured: log it, but never reveal details to the browser.
          console.error("[auth] authorize failed:", error);
          return null;
        }

        if (!user) {
          await Promise.all([recordHit(userKey, LOCK_WINDOW_SECONDS), recordHit(ipKey, LOCK_WINDOW_SECONDS)]);
          return null;
        }

        await clearHits(userKey); // a correct password resets the counter
        return user;
      },
    }),
  ],

  pages: { signIn: "/admin/login" },

  // Stateless JWT cookie; an admin must sign in again after 8 hours.
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },

  callbacks: {
    // Copy id + role into the token at sign-in...
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // ...and expose them on the session object.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

/** Returns the signed-in admin session, or null. Use inside server code. */
export function getAdminSession() {
  return getServerSession(authOptions);
}

/** Standard 401 response for API routes. */
export function unauthorized() {
  return NextResponse.json({ error: "You must be signed in as an admin." }, { status: 401 });
}
