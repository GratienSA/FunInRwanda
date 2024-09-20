"use server";
import prismadb from "../lib/prismadb";
import { SafeBooking, SafeListing, SafeReview, SafeUser } from "../types";

export interface IListingsParams {
  userId?: string;
  category?: string;
  activityType?: string;
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  locationName?: string;
  startDate?: string;
  endDate?: string;
}

export default async function getListings(params: IListingsParams): Promise<SafeListing[]> {
  try {
    const {
      userId,
      category,
      activityType,
      difficulty,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      locationName,
      startDate,
      endDate
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (activityType) {
      query.activityType = activityType;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.price.lte = maxPrice;
      }
    }

    if (minDuration !== undefined || maxDuration !== undefined) {
      query.duration = {};
      if (minDuration !== undefined) {
        query.duration.gte = minDuration;
      }
      if (maxDuration !== undefined) {
        query.duration.lte = maxDuration;
      }
    }

    if (locationName) {
      query.locationName = { contains: locationName, mode: 'insensitive' };
    }

    if (startDate && endDate) {
      query.NOT = {
        bookings: {
          OR: [
            {
              endDate: { gte: startDate },
              startDate: { lte: startDate },
            },
            { 
              startDate: { lte: endDate },
              endDate: { gte: endDate },
            },
          ]
        }
      }
    }

    const listings = await prismadb.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        bookings: true,
        reviews: true
      }
    });

    const safeListings: SafeListing[] = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null,
      } as SafeUser,
      bookings: listing.bookings.map(booking => ({
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
      } as SafeBooking)),
      reviews: listing.reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      } as SafeReview))
    }));

    return safeListings;
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    throw new Error(error.message || "Error fetching listings");
  }
}