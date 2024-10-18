
import prismadb from "../lib/prismadb";
import { SafeListing, SafeUser, SafeBooking, SafeReview } from "../types";
import { z } from "zod";

export const ListingsParamsSchema = z.object({
  userId: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  category: z.string().optional(),
  activityType: z.string().optional(),
  difficulty: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minDuration: z.number().optional(),
  maxDuration: z.number().optional(),
  minParticipants: z.number().optional(),
  maxParticipants: z.number().optional(),
  ageRestriction: z.number().optional(),
  locationName: z.string().optional(),
  isInstantBook: z.boolean().optional(),
});

export type IListingsParams = z.infer<typeof ListingsParamsSchema>;

const transformToSafeListing = (listing: any): SafeListing => ({
  ...listing,
  createdAt: listing.createdAt.toISOString(),
  updatedAt: listing.updatedAt.toISOString(),
  user: transformToSafeUser(listing.user),
  bookings: listing.bookings.map(transformToSafeBooking),
  reviews: listing.reviews.map(transformToSafeReview),
});

const transformToSafeUser = (user: any): SafeUser => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
  emailVerified: user.emailVerified?.toISOString() || null,
});

const transformToSafeBooking = (booking: any): SafeBooking => ({
  ...booking,
  createdAt: booking.createdAt.toISOString(),
  updatedAt: booking.updatedAt.toISOString(),
  startDate: booking.startDate.toISOString(),
  endDate: booking.endDate.toISOString(),
});

const transformToSafeReview = (review: any): SafeReview => ({
  ...review,
  createdAt: review.createdAt.toISOString(),
  updatedAt: review.updatedAt.toISOString(),
});

export default async function getListings(params: IListingsParams): Promise<{ listings: SafeListing[], totalCount: number }> {
  try {
    const validatedParams = ListingsParamsSchema.parse(params);
    const { 
      userId,
      page = 1, 
      limit = 10, 
      category,
      activityType,
      difficulty,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      minParticipants,
      maxParticipants,
      ageRestriction,
      locationName,
      isInstantBook
    } = validatedParams;

    const skip = (page - 1) * limit;

    let filter: any = {};

    if (userId) filter.userId = userId;
    if (category) filter.category = category;
    if (activityType) filter.activityType = activityType;
    if (difficulty) filter.difficulty = difficulty;
    if (locationName) filter.locationName = { contains: locationName };
    if (isInstantBook !== undefined) filter.isInstantBook = isInstantBook;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.gte = minPrice;
      if (maxPrice !== undefined) filter.price.lte = maxPrice;
    }

    if (minDuration !== undefined || maxDuration !== undefined) {
      filter.duration = {};
      if (minDuration !== undefined) filter.duration.gte = minDuration;
      if (maxDuration !== undefined) filter.duration.lte = maxDuration;
    }

    if (minParticipants !== undefined || maxParticipants !== undefined) {
      filter.minParticipants = {};
      filter.maxParticipants = {};
      if (minParticipants !== undefined) {
        filter.maxParticipants.gte = minParticipants;
      }
      if (maxParticipants !== undefined) {
        filter.minParticipants.lte = maxParticipants;
      }
    }

    if (ageRestriction !== undefined) {
      filter.ageRestriction = { lte: ageRestriction };
    }

    console.log("Filter:", filter);

    const [listings, totalCount] = await Promise.all([
      prismadb.listing.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          bookings: { include: { listing: true } },
          reviews: true,
        },
        skip,
        take: limit,
      }),
      prismadb.listing.count({ where: filter }),
    ]);

    console.log("Total Count of Listings:", totalCount);
    console.log("Raw Listings from DB:", listings);

    const safeListings = listings.map(transformToSafeListing);

    return { listings: safeListings, totalCount };
    
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalCount: 0 };
  }
}