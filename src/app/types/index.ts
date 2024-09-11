import { Booking, Listing, Review, User } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  user: SafeUser;
  bookings: SafeBooking[];
  reviews: SafeReview[];
};

export type SafeUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeBooking = Omit<Booking, "createdAt" | "updatedAt" | "startDate" | "endDate"> & {
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

export type SafeReview = Omit<Review, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
