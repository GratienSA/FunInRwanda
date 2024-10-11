import prismadb from "../lib/prismadb"
import { SafeUser } from "../types"

export async function fetchUsers(): Promise<SafeUser[]> {
  const users = await prismadb.user.findMany()
  return users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified?.toISOString() || null,
    isOAuth: false, 
    role: user.role,
    favoriteIds: user.favoriteIds || [],
    isTwoFactorEnabled: user.isTwoFactorEnabled || false, 
  }))
}