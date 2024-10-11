import { Booking, Listing, Review, User, UserRole } from "@prisma/client";

export interface ExtendedUser extends User {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  emailVerified: Date | null;
  hashedPassword: string | null;
  favoriteIds: string[]; // IDs des favoris
  createdAt: Date; // Date de création
  updatedAt: Date; // Date de mise à jour
}

export type SafeUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string; // Format de date sous forme de chaîne
  updatedAt: string; // Format de date sous forme de chaîne
  emailVerified: string | null; // Peut être null
  favoriteIds: string[]; // IDs des favoris
  role: UserRole; // Rôle de l'utilisateur
  isTwoFactorEnabled: boolean; // Indique si l'authentification à deux facteurs est activée
  isOAuth: boolean; // Indique si l'utilisateur utilise OAuth
};

export type SafeListing = Omit<Listing, "createdAt" | "updatedAt" | "userId"> & {
  createdAt: string; // Format de date sous forme de chaîne
  updatedAt: string; // Format de date sous forme de chaîne
  user: SafeUser; // Utilisateur associé à l'annonce
  bookings: SafeBooking[]; // Réservations associées à l'annonce
  reviews: SafeReview[]; // Avis associés à l'annonce
};

export type SafeBooking = Omit<Booking, "createdAt" | "updatedAt" | "startDate" | "endDate"> & {
  createdAt: string; // Format de date sous forme de chaîne
  updatedAt: string; // Format de date sous forme de chaîne
  startDate: string; // Date de début au format chaîne
  endDate: string; // Date de fin au format chaîne
  status: string; // Ajoutez cette ligne pour inclure le statut
  listing: SafeListing; // Annonce associée à la réservation
  user: SafeUser; // Utilisateur associé à la réservation
};

export type SafeReview = Omit<Review, "createdAt" | "updatedAt"> & {
  createdAt: string; // Format de date sous forme de chaîne
  updatedAt: string; // Format de date sous forme de chaîne
};

export type RegionSelectValue = {
  label?: string; // Label pour la région
  value?: string; // Valeur pour la région
  latitude?: number; // Latitude pour la région
  longitude?: number; // Longitude pour la région
} | null;

export interface BookingFormData {
  title: string; // Titre de l'annonce
  description: string; // Description de l'annonce
  imageSrc: string[]; // Chemins d'image pour l'annonce
  category: string; // Catégorie de l'annonce
  activityType: string; // Type d'activité
  duration: number; // Durée de l'activité
  difficulty: string; // Niveau de difficulté
  minParticipants: number; // Nombre minimum de participants
  maxParticipants: number; // Nombre maximum de participants
  ageRestriction?: number | null; // Restriction d'âge, optionnelle
  equipment: string[]; // Équipements nécessaires
  locationName: string; // Nom de la localisation
  locationAddress: string; // Adresse de la localisation
  latitude: number; // Latitude de la localisation
  longitude: number; // Longitude de la localisation
  price: number; // Prix de l'annonce
  currency: string; // Devise, par défaut "EUR"
  isInstantBook: boolean; // Indique si la réservation est instantanée
  cancellationPolicy: string; // Politique d'annulation
}

export type FormattedBooking = Omit<SafeBooking, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> & {
  startDate: string;  // Changement de Date à string
  endDate: string;    // Changement de Date à string
  createdAt: string;  // Changement de Date à string
  updatedAt: string;  // Changement de Date à string
  user: Omit<SafeUser, 'emailVerified' | 'createdAt' | 'updatedAt'> & {
    emailVerified: string | null; // Changement pour correspondre à SafeUser
    createdAt: string;            // Changement de Date à string
    updatedAt: string;            // Changement de Date à string
  };
  listing: Omit<SafeListing, 'createdAt' | 'updatedAt'> & {
    createdAt: string;  // Changement de Date à string
    updatedAt: string;  // Changement de Date à string
    user: Omit<SafeUser, 'emailVerified' | 'createdAt' | 'updatedAt'> & {
      emailVerified: string | null; // Changement pour correspondre à SafeUser
      createdAt: string;            // Changement de Date à string
      updatedAt: string;            // Changement de Date à string
    };
  };
};


export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
}

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
      image: string | null
  }
  listing: {
      title: string
  }
}


export type FormattedCustomersTable = {
  id: string
  name: string
  email: string
  image: string
  total_bookings: number
  total_pending: string
  total_paid: string
}