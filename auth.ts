import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prismadb from "./src/lib/prismadb";
import { getUserById } from "./src/data/user";
import { getAccountByUserId } from "./src/data/account";
import { UserRole } from "@/types";
import authConfig from "auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        try {
          await prismadb.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
          });
        } catch (error) {
          console.error("Error in linkAccount event:", error);
        }
      }
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (user.id) {
        try {
          const existingUser = await getUserById(user.id);

          if (!existingUser?.emailVerified) {
            console.log(`Tentative de connexion avec un email non vérifié: ${user.email}`);
            return false;
          }

          return true; // Authentification réussie
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return false;
    },

    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string | null;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.favoriteIds = token.favoriteIds as string[] | undefined;
        session.user.emailVerified = token.emailVerified 
          ? new Date(token.emailVerified as string) 
          : null;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      try {
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        const existingAccount = await getAccountByUserId(existingUser.id);

        return {
          ...token,
          isOAuth: !!existingAccount,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role, 
          favoriteIds: existingUser.favoriteIds,
          emailVerified: existingUser.emailVerified 
            ? existingUser.emailVerified.toISOString()
            : null,
        };
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      }
    },
  },
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
});
