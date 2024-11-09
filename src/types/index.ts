import { Booking, Listing, Review, User, Payment, StripeCustomer,} from "@prisma/client";
import { UserRole as PrismaUserRole } from "@prisma/client";

export type UserRole = PrismaUserRole;
// Extension du type User avec des propriétés supplémentaires
export interface ExtendedUser extends User {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  emailVerified: Date | null;
  hashedPassword: string | null;
  favoriteIds: string[];
  createdAt: Date;
  updatedAt: Date;
  stripeCustomer?: StripeCustomer
}

// Type SafeUser : version sécurisée de User pour l'utilisation côté client
export type SafeUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  favoriteIds: string[];
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  stripeCustomerId?: string | null;
};

// Type SafeListing : version sécurisée de Listing pour l'utilisation côté client
export type SafeListing = Omit<Listing, "createdAt" | "updatedAt" | "userId"> & {
  id: string;
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  activityType: string;
  duration: number;
  difficulty: string;
  minParticipants: number;
  maxParticipants: number;
  ageRestriction: number | null;
  equipment: string[];
  locationName: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  isInstantBook: boolean;
  cancellationPolicy: string;
  viewCount: number;
  bookingCount: number;
  reviewCount: number;
  reviewAverage: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: SafeUser;
  bookings?: SafeBooking[];
  reviews?: SafeReview[];
};

// Type SafeReview : version sécurisée de Review pour l'utilisation côté client
export type SafeReview = Omit<Review, "createdAt" | "updatedAt"> & {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment: string | null; 
  createdAt: string;
  updatedAt: string;
  user: SafeUser;
  listing: SafeListing | null;
};

// Type SafePayment mis à jour
export type SafePayment = Omit<Payment, "createdAt" | "updatedAt"> & {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  stripeCustomerId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
  
};

// Type SafeBooking mis à jour
export type SafeBooking = Omit<Booking, "createdAt" | "updatedAt" | "startDate" | "endDate"> & {
  id: string;
  listingId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  paymentIntentId: string | null;
  listing: SafeListing | null;
  user: SafeUser;

};





// Type pour la sélection de région
export type RegionSelectValue = {
  label?: string;
  value?: string;
  latitude?: number;
  longitude?: number;
} | null;

// Interface pour les données du formulaire de réservation
export interface BookingFormData {
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  activityType: string;
  duration: number;
  difficulty: string;
  minParticipants: number;
  maxParticipants: number;
  ageRestriction?: number | null;
  equipment: string[];
  locationName: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  isInstantBook: boolean;
  cancellationPolicy: string;
}

// Fonction pour formater la devise
export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
}

// Fonction pour formater une date en format local
export const formatDateToLocal = (
  dateStr: string | null | undefined,
  locale: string = 'en-US'
): string => {
  if (!dateStr) {
    return 'Date non disponible';
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
}

// Type pour le tableau des clients formaté
export type FormattedCustomersTable = {
  id: string
  name: string
  email: string
  profileImage: string
  total_bookings: number
  total_pending: string
  total_paid: string
}

export type State = {
  message: string | null;
  errors: {
    userId?: string[];
    listingId?: string[];
    startDate?: string[];
    endDate?: string[];
    totalPrice?: string[];
  };
};

// ReceivedBooking mis à jour
export type ReceivedBooking = {
  id: string;
  userId: string;
  listingId: string;
  startDate: Date | null;
  endDate: Date | null;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  paymentIntentId: string | null;
  user: {
    id: string | undefined;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    hashedPassword: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    profileImage: string | null;
    favoriteIds: string[];
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
  listing: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      createdAt: Date;
      updatedAt: Date;
      role: UserRole;
      profileImage: string | null;
      favoriteIds: string[];
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    };
    bookings: Array<{
      id: string;
      startDate: Date;
      endDate: Date;
      createdAt: Date;
      updatedAt: Date;
      status: string;
    }>;
    reviews: Array<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
};

// FormattedBooking mis à jour
export type FormattedBooking = Omit<SafeBooking, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt' | 'user' | 'listing'> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  paymentIntentId: string | null;
  user: Omit<SafeUser, 'emailVerified' | 'createdAt' | 'updatedAt'> & {
    emailVerified: string | null;
    createdAt: string;
    updatedAt: string;
  };
  listing: (Omit<SafeListing, 'createdAt' | 'updatedAt' | 'user' | 'bookings' | 'reviews'> & {
    createdAt: string;
    updatedAt: string;
    user: Omit<SafeUser, 'emailVerified' | 'createdAt' | 'updatedAt'> & {
      emailVerified: string | null;
      createdAt: string;
      updatedAt: string;
    };
    bookings: Array<Omit<SafeBooking, 'listing' | 'user' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> & {
      startDate: string;
      endDate: string;
      createdAt: string;
      updatedAt: string;
    }>;
    reviews: Array<Omit<SafeReview, 'createdAt' | 'updatedAt'> & {
      createdAt: string;
      updatedAt: string;
    }>;
  }) | null;
};

// ExtendedReceivedBooking
export type ExtendedReceivedBooking = ReceivedBooking;

// type pour StripeCustomer
export type SafeStripeCustomer = {
  id: string;
  userId: string;
  stripeCustomerId: string;
};