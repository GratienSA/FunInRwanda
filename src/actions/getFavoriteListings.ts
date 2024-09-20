
"use server";

import { useCurrentUser } from '../hooks/useCurrentUser';
import prismadb from '../lib/prismadb';


export async function getFavoriteListings(id: string | undefined) {
  try {
    const currentUser = await useCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites = await prismadb.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])]
        }
      }
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(),
    }));

    return safeFavorites;
  } catch (error) {
    console.error("Error fetching favorite listings:", error);
    return [];
  }
}