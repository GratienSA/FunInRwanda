"use server";

import { auth } from "@/auth"
import prismadb from '../lib/prismadb';

export async function getFavoriteListings() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return [];
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        favoriteIds: true
      }
    });

    if (!user) {
      return [];
    }

    const favorites = await prismadb.listing.findMany({
      where: {
        id: {
          in: user.favoriteIds
        }
      },
      include: {
        user: true
      }
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(),
      updatedAt: favorite.updatedAt.toISOString(),
      user: {
        ...favorite.user,
        createdAt: favorite.user.createdAt.toISOString(),
        updatedAt: favorite.user.updatedAt.toISOString(),
        emailVerified: favorite.user.emailVerified?.toISOString() || null,
      }
    }));

    return safeFavorites;
  } catch (error: any) {
    console.error("Error fetching favorite listings:", error);
    return [];
  }
}