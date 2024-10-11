"use server";

import prismadb from "../lib/prismadb";
import { formatCurrency, ReceivedBooking, SafeBooking, SafeListing, SafeUser } from "../types";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
    page?: number;
    limit?: number;
}

type QueryType = {
    listingId?: string;
    userId?: string;
    listing?: { userId: string };
};


export default async function getBookings(params: IParams): Promise<{ bookings: SafeBooking[], totalCount: number }> {
    try {
        const { listingId, userId, authorId, page = 1, limit = 10 } = params;

        if (!listingId && !userId && !authorId) {
            throw new Error("At least one parameter (listingId, userId, or authorId) is required");
        }

        const query: QueryType = {};

        if (listingId) query.listingId = listingId;
        if (userId) query.userId = userId;
        if (authorId) query.listing = { userId: authorId };

        const [bookings, totalCount] = await Promise.all([
            prismadb.booking.findMany({
                where: query,
                include: {
                    listing: {
                        include: {
                            user: true,
                            bookings: true,
                            reviews: true,
                        }
                    },
                    user: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prismadb.booking.count({ where: query })
        ]);

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
                user: {
                    ...booking.listing.user,
                    createdAt: booking.listing.user.createdAt.toISOString(),
                    updatedAt: booking.listing.user.updatedAt.toISOString(),
                    emailVerified: booking.listing.user.emailVerified?.toISOString() || null,
                } as SafeUser,
                bookings: booking.listing.bookings.map(b => ({
                    ...b,
                    createdAt: b.createdAt.toISOString(),
                    updatedAt: b.updatedAt.toISOString(),
                    startDate: b.startDate.toISOString(),
                    endDate: b.endDate.toISOString(),
                })) as SafeBooking[],
                reviews: booking.listing.reviews.map(r => ({
                    ...r,
                    createdAt: r.createdAt.toISOString(),
                    updatedAt: r.updatedAt.toISOString(),
                })),
            } as SafeListing,
            user: {
                ...booking.user,
                createdAt: booking.user.createdAt.toISOString(),
                updatedAt: booking.user.updatedAt.toISOString(),
                emailVerified: booking.user.emailVerified?.toISOString() || null,
            } as SafeUser,
        }));

        return { bookings: safeBookings, totalCount };
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Could not fetch bookings");
    }
}

type CardData = {
    numberOfCustomers: number;
    numberOfBookings: number;
    totalPaidBookings: number;
    totalPendingBookings: number;
  };
  

export async function fetchCardData(): Promise<CardData> {
    try {
      const safeSum = (value: number | null | undefined) => value ?? 0;
  
      const [bookingCount, customerCount, totalBookingsAmount] = await Promise.all([
        prismadb.booking.count(),
        prismadb.user.count(),
        prismadb.booking.aggregate({
          _sum: {
            totalPrice: true,
          },
        }),
      ]);
  
      const confirmedBookings = await prismadb.booking.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          endDate: {
            lt: new Date(),
          },
        },
      });
  
      const numberOfBookings = bookingCount;
      const numberOfCustomers = customerCount;
      const totalPaidBookings = safeSum(confirmedBookings._sum?.totalPrice);
      const totalPendingBookings = safeSum(totalBookingsAmount._sum?.totalPrice) - totalPaidBookings;
  
      return {
        numberOfCustomers,
        numberOfBookings,
        totalPaidBookings,
        totalPendingBookings,
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error(`Failed to fetch card data: ${error.message}`);
    }
  }
  

  export async function fetchLatestBookings(): Promise<ReceivedBooking[]> {
    try {
        const latestBookings = await prismadb.booking.findMany({
            include: {
                user: { 
                    select: { 
                        name: true, 
                        image: true, 
                        email: true 
                    } 
                },
                listing: { 
                    select: { 
                        title: true 
                    } 
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        return latestBookings.map((booking): ReceivedBooking => ({
            id: booking.id,
            userId: booking.userId,
            listingId: booking.listingId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            status: booking.status,
            user: {
                name: booking.user.name,
                email: booking.user.email,
                image: booking.user.image
            },
            listing: {
                title: booking.listing.title
            }
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest bookings.');
    }
}

export async function deleteBooking(id: string) {
    try {
        await prismadb.booking.delete({ where: { id } });
        revalidatePath('/dashboard/bookings');
        return { message: 'Deleted Booking' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Booking.' };
    }
}

export async function fetchFilteredBookings(query: string, currentPage: number): Promise<(ReceivedBooking | null)[]> {
    const ITEMS_PER_PAGE = 10;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        console.log('Fetching bookings with query:', query, 'and currentPage:', currentPage);

        const aggregationPipeline = [
            {
                $match: query
                    ? {
                          $or: [
                              { "user.name": { $regex: query, $options: "i" } },
                              { "user.email": { $regex: query, $options: "i" } },
                              { "listing.title": { $regex: query, $options: "i" } },
                          ],
                      }
                    : {},
            },
            {
                $lookup: {
                    from: "User",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $lookup: {
                    from: "Listing",
                    localField: "listingId",
                    foreignField: "_id",
                    as: "listing",
                },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$listing", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    id: { $toString: "$_id" },
                    userId: { $toString: "$userId" },
                    listingId: { $toString: "$listingId" },
                    startDate: 1,
                    endDate: 1,
                    totalPrice: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    status: {
                        $cond: {
                            if: { $gt: ["$startDate", "$$NOW"] },
                            then: "Upcoming",
                            else: {
                                $cond: {
                                    if: { $lt: ["$endDate", "$$NOW"] },
                                    then: "Completed",
                                    else: "Active"
                                }
                            }
                        }
                    },
                    "user.name": 1,
                    "user.email": 1,
                    "user.image": 1,
                    "listing.title": 1,
                },
            },
            { $skip: offset },
            { $limit: ITEMS_PER_PAGE },
        ];

        const bookings = await prismadb.booking.findMany({
            include: {
              user: true,
              listing: true,
            },
          });
          

        console.log('Bookings fetched:', bookings);

        if (!Array.isArray(bookings)) {
            throw new Error('Unexpected response format from database');
        }

        return bookings.map((booking: any): ReceivedBooking | null => {
            if (!booking.user || !booking.listing) {
                console.warn('Booking with missing user or listing:', booking);
                return null;
            }

            return {
                id: booking.id,
                userId: booking.userId,
                listingId: booking.listingId,
                startDate: new Date(booking.startDate.$date),
                endDate: new Date(booking.endDate.$date),
                totalPrice: booking.totalPrice,
                createdAt: new Date(booking.createdAt.$date),
                updatedAt: new Date(booking.updatedAt.$date),
                status: booking.status,
                user: {
                    name: booking.user.name,
                    email: booking.user.email,
                    image: booking.user.image,
                },
                listing: {
                    title: booking.listing.title,
                },
            };
        });

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch bookings.');
    }
}
       
export async function fetchBookingsPages(query: string) {
    const ITEMS_PER_PAGE = 10;
    try {
        const total = await prismadb.booking.count({
            where: {
                OR: [
                    { user: { name: { contains: query, mode: 'insensitive' } } },
                    { user: { email: { contains: query, mode: 'insensitive' } } },
                    { listing: { title: { contains: query, mode: 'insensitive' } } }
                ]
            }
        });
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of bookings.');
    }
}

const FormSchema = z.object({
    id: z.string(),
    userId: z.string({
        invalid_type_error: 'Please select a user.',
    }),
    listingId: z.string({
        invalid_type_error: 'Please select a listing.',
    }),
    totalPrice: z.coerce
        .number()
        .gt(0, { message: 'Please enter a total price greater than $0.' }),
    startDate: z.string(),
    endDate: z.string(),
});
const CreateBooking = FormSchema.omit({ id: true });
const UpdateBooking = FormSchema.omit({ id: true });

export type State = {
    message: string | null;
    errors?: {
      userId?: string[];
      listingId?: string[];
      startDate?: string[];
      endDate?: string[];
      totalPrice?: string[];
    };
  };

export async function createBooking(prevState: State, formData: FormData) {
    const validatedFields = CreateBooking.safeParse({
        userId: formData.get('userId'),
        listingId: formData.get('listingId'),
        totalPrice: formData.get('totalPrice'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Booking.',
        };
    }

    const { userId, listingId, totalPrice, startDate, endDate } = validatedFields.data;
    const totalPriceInCents = totalPrice * 100;

    try {
        await prismadb.booking.create({
            data: {
                userId,
                listingId,
                totalPrice: totalPriceInCents,
                startDate,
                endDate,
            }
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Booking.',
        };
    }
    revalidatePath('/dashboard/bookings');
    redirect('/dashboard/bookings');
}

export async function updateBooking(
    id: string,
    prevState: any,
    formData: FormData
) {
    const validatedFields = UpdateBooking.safeParse({
        userId: formData.get('userId'),
        listingId: formData.get('listingId'),
        totalPrice: formData.get('totalPrice'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Booking.',
        };
    }

    const { userId, listingId, totalPrice, startDate, endDate } = validatedFields.data;
    const totalPriceInCents = totalPrice * 100;

    try {
        await prismadb.booking.update({
            where: { id },
            data: {
                userId,
                listingId,
                totalPrice: totalPriceInCents,
                startDate,
                endDate,
            }
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Update Booking.' };
    }
    revalidatePath('/dashboard/bookings');
    redirect('/dashboard/bookings');
}


export async function fetchBookingById(id: string): Promise<SafeBooking | null> {
    const booking = await prismadb.booking.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            accounts: true
          }
        },
        listing: {
          include: {
            user: true,
            bookings: {
              include: {
                user: true,  // Include user for each booking
                listing: true
              }
            },
            reviews: true
          }
        },
      },
    })
  
    if (!booking) return null
  
    const isOAuth = booking.user.accounts.length > 0
  
    const safeListing: SafeListing = {
      ...booking.listing,
      createdAt: booking.listing.createdAt.toISOString(),
      updatedAt: booking.listing.updatedAt.toISOString(),
      user: {
        ...booking.listing.user,
        createdAt: booking.listing.user.createdAt.toISOString(),
        updatedAt: booking.listing.user.updatedAt.toISOString(),
        emailVerified: booking.listing.user.emailVerified?.toISOString() || null,
        isOAuth: booking.listing.user.hashedPassword === null,
        favoriteIds: booking.listing.user.favoriteIds,
        role: booking.listing.user.role,
        isTwoFactorEnabled: booking.listing.user.isTwoFactorEnabled,
      },
      bookings: booking.listing.bookings.map(b => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        listing: {} as SafeListing, // We'll fix this circular reference later
        user: {
          ...b.user,
          createdAt: b.user.createdAt.toISOString(),
          updatedAt: b.user.updatedAt.toISOString(),
          emailVerified: b.user.emailVerified?.toISOString() || null,
          isOAuth: b.user.hashedPassword === null,
          favoriteIds: b.user.favoriteIds,
          role: b.user.role,
          isTwoFactorEnabled: b.user.isTwoFactorEnabled,
        },
      })),
      reviews: booking.listing.reviews.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    }
  
    
    safeListing.bookings = safeListing.bookings.map(b => ({
      ...b,
      listing: safeListing
    }))
  
    return {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      listing: safeListing,
      user: {
        ...booking.user,
        createdAt: booking.user.createdAt.toISOString(),
        updatedAt: booking.user.updatedAt.toISOString(),
        emailVerified: booking.user.emailVerified?.toISOString() || null,
        isOAuth,
        favoriteIds: booking.user.favoriteIds,
        role: booking.user.role,
        isTwoFactorEnabled: booking.user.isTwoFactorEnabled,
      }
    };
  }