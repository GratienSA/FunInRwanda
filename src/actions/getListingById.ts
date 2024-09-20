"use server";
import prismadb from '../lib/prismadb';
import { SafeBooking, SafeListing, SafeReview, SafeUser } from '../types';


interface IParams {
    listingId?: string;
}

// Fonction pour convertir un User en SafeUser
function toSafeUser(user: any): SafeUser {
    return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified?.toISOString() || null,
    };
}

// Fonction pour convertir un Booking en SafeBooking
function toSafeBooking(booking: any): SafeBooking {
    return {
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        listing: booking.listing ? toSafeListing(booking.listing) : null,
    };
}

// Fonction pour convertir un Review en SafeReview
function toSafeReview(review: any): SafeReview {
    return {
        ...review,
        createdAt: review.createdAt.toISOString(),
    };
}

// Fonction pour convertir un Listing en SafeListing
function toSafeListing(listing: any): SafeListing {
    return {
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        user: toSafeUser(listing.user),
    };
}

export default async function getListingById(params: IParams): Promise<(SafeListing & { user: SafeUser }) | null> {
    try {
        const { listingId } = params;

        if (!listingId) {
            throw new Error("Listing ID is required");
        }

        const listing = await prismadb.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true,
                bookings: {
                    include: {
                        user: true
                    }
                },
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!listing) {
            return null;
        }

        return {
            ...toSafeListing(listing),
            user: toSafeUser(listing.user),
            bookings: listing.bookings.map(toSafeBooking),
            reviews: listing.reviews.map(toSafeReview),
        };
    } catch (error: any) {
        console.error("Error fetching listing:", error);
        throw new Error(error.message || "Failed to fetch listing");
    }
}