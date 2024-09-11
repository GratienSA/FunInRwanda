import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";


export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    role: UserRole;
    isOAuth: boolean;
};


declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }

    interface User extends DefaultUser {
        role: UserRole;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends NextAuthJWT {
        role?: UserRole; 
        isOAuth?: boolean;
    }
}
