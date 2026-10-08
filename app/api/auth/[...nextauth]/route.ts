import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // Using our fast shared prisma instance
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Strict check: if fields are empty, reject immediately
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        // 2. Find user in Supabase database
        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username }
        });
        
        // 3. Strict check: if username doesn't exist, return null (REJECT)
        if (!admin) {
          return null;
        }
        
        // 4. Check password hash match
        const isValid = await bcrypt.compare(credentials.password, admin.password);
        
        // 5. Strict check: if password is wrong, return null (REJECT)
        if (!isValid) {
          return null;
        }
        
        // 6. Only if everything matches, return the user object
        return { 
          id: admin.id.toString(), 
          name: admin.username, 
          role: admin.role 
        };
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };