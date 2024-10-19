import { Booking, Listing, Review, User, UserRole } from "@prisma/client";

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
}

// Type SafeUser : version sécurisée de User pour l'utilisation côté client
export type SafeUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  favoriteIds: string[];
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

// Type SafeListing : version sécurisée de Listing pour l'utilisation côté client
export type SafeListing = Omit<Listing, "createdAt" | "updatedAt" | "userId"> & {
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: SafeUser;
  bookings: SafeBooking[];
  reviews: SafeReview[];
};

// Type SafeBooking : version sécurisée de Booking pour l'utilisation côté client
export type SafeBooking = Omit<Booking, "createdAt" | "updatedAt" | "startDate" | "endDate"> & {
  createdAt: string;
  updatedAt: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  listing: SafeListing;
  user: SafeUser;
};

// Type SafeReview : version sécurisée de Review pour l'utilisation côté client
export type SafeReview = Omit<Review, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
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

// Type FormattedBooking : version formatée de SafeBooking avec des dates en string
export type FormattedBooking = Omit<SafeBooking, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  user: Omit<SafeUser, 'emailVerified' | 'createdAt' | 'updatedAt'> & {
    emailVerified: string | null;
    createdAt: string;
    updatedAt: string;
  };
  listing: Omit<SafeListing, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    user: Omit<SafeUser, 'emailVerified' | 'createdAt' | 'updatedAt'> & {
      emailVerified: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};

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

// Type pour une réservation reçue du serveur
export type ReceivedBooking = {
  id: string
  userId: string
  listingId: string
  startDate: Date | null
  endDate: Date | null
  totalPrice: number
  createdAt: Date
  updatedAt: Date
  status: string
  user: {
      name: string | null
      email: string | null
      profileImage: string | null
  }
  listing: {
      title: string
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


// Les types Safe* (SafeUser, SafeListing, etc.) sont des versions sécurisées des types de base, adaptées pour l'utilisation côté client. 
// Ils convertissent notamment les dates en chaînes de caractères.
// BookingFormData définit la structure des données pour le formulaire de réservation.
// FormattedBooking est une version plus détaillée de SafeBooking, incluant des informations sur l'utilisateur et l'annonce.
// Les fonctions formatCurrency et formatDateToLocal sont des utilitaires pour formater respectivement les montants et les dates.
// ReceivedBooking représente la structure d'une réservation telle qu'elle est reçue du serveur.
// FormattedCustomersTable est utilisé pour structurer les données des clients dans un tableau, probablement pour un tableau de bord administratif