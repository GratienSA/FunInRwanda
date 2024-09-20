"use server";
import prismadb from "../lib/prismadb";
import { SafeBooking, SafeListing } from "../types";


interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getBookings(params: IParams): Promise<SafeBooking[]> {
    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        }

        if (userId) {
            query.userId = userId;
        }

        if (authorId) {
            query.listing = { userId: authorId };
        }

        const bookings = await prismadb.booking.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const safeBookings: SafeBooking[] = bookings.map((booking) => ({
            ...booking,
            createdAt: booking.createdAt.toISOString(),
            startDate: booking.startDate.toISOString(),
            endDate: booking.endDate.toISOString(),
            updatedAt: booking.updatedAt.toISOString(), 
            listing: {
                ...booking.listing,
                createdAt: booking.listing.createdAt.toISOString(),
                updatedAt: booking.listing.updatedAt.toISOString(), 
            } as SafeListing
        }));

        return safeBookings;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Could not fetch bookings");
    }
}