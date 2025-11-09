import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";


export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  adapter: PrismaAdapter(prisma), // Łączy NextAuth z bazą danych przez Prisma. Automatycznie zarządza tabelami: User, Account, Session, VerificationToken
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        
        // Find user in database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string }
        });
        // Check if user exists and password matches
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);

          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            };
          }
        }
        // If user does not exist or password is incorrect, return null
        return null;
      }
    })],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;


export const { handlers, auth, signIn, signOut } = NextAuth(config);