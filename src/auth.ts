import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import authConfig from "./auth.config";
import prismadb from "./app/libs/prismadb";
import { getUserById } from "./app/data/user";
import { UserRole } from "./app/schemas";
import { getAccountByUserId } from "./app/data/account";

export const {
  auth,
  signIn,
  signOut,
  handlers
} = NextAuth({
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      
      if ("emailVerified" in user) {
        const existingUser = await getUserById(user.id);
        return !!existingUser?.emailVerified;
      }
      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      
      return token;
    },
  },
})


export const { GET, POST } = handlers