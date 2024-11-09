"use server";

import prismadb from "./prismadb"
import { User } from "next-auth"

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prismadb.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTwoFactorEnabled: true,
        isOAuth: true,
      }
    });
    return user as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}