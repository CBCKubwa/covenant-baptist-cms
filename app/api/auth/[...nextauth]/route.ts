import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// All login logic lives in lib/auth.ts so other files (admin layout, API routes)
// can reuse the same options to read the session.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
