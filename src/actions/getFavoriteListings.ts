"use server";

import { auth } from 'auth';
import prismadb from '../lib/prismadb';
import { SafeListing, SafeUser, SafeBooking, SafeReview } from '../types'; // Assurez-vous d'importer les types nécessaires

export async function getFavoriteListings(): Promise<SafeListing[]> {
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
        user: true,
        bookings: true,
        reviews: true
      }
    });

    const safeFavorites: SafeListing[] = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(),
      updatedAt: favorite.updatedAt.toISOString(),
      user: {
        ...favorite.user,
        createdAt: favorite.user.createdAt.toISOString(),
        updatedAt: favorite.user.updatedAt.toISOString(),
        emailVerified: favorite.user.emailVerified?.toISOString() || null,
      } as SafeUser,
      bookings: favorite.bookings.map(booking => ({
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
      })) as SafeBooking[],
      reviews: favorite.reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      })) as SafeReview[]
    }));

    return safeFavorites;
  } catch (error: any) {
    console.error("Error fetching favorite listings:", error);
    return [];
  }
}