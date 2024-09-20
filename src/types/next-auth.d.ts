import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      favoriteIds?: string[];
      emailVerified: Date | null;
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    favoriteIds?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
    favoriteIds?: string[];
    emailVerified?: string | null;
  }
}