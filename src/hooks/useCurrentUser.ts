import { useSession } from "next-auth/react";
import { SafeUser, ExtendedUser } from "../types";
import { UserRole } from "@prisma/client";

export const useCurrentUser = (): SafeUser | null => {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) {
    return null;
  }

  const user = session.user as ExtendedUser;

  const safeUser: SafeUser = {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    image: user.image || '',
    emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
    hashedPassword: (user as any).hashedPassword || null,
    favoriteIds: (user as any).favoriteIds || [],
    role: (user as any).role || UserRole.USER,
    isTwoFactorEnabled: (user as any).isTwoFactorEnabled || false,
    isOAuth: (user as any).isOAuth || false,
    createdAt: (user as any).createdAt ? new Date((user as any).createdAt).toISOString() : new Date().toISOString(),
    updatedAt: (user as any).updatedAt ? new Date((user as any).updatedAt).toISOString() : new Date().toISOString(),
  };

  return safeUser;
};