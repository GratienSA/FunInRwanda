import prismadb from "../lib/prismadb";
import { SafeUser } from "../types";
import { UserRole } from "../types"; 

// Fonction pour récupérer tous les utilisateurs
export async function fetchUsers(): Promise<SafeUser[]> {
  const users = await prismadb.user.findMany();
  return users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified?.toISOString() || null,
    isOAuth: false,
    favoriteIds: user.favoriteIds || [],
    isTwoFactorEnabled: user.isTwoFactorEnabled || false,
  }));
}

