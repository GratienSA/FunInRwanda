import Image from 'next/image'
import { RefreshCcw } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { Card, CardContent, CardHeader } from '../ui/card'
import { fetchLatestBookings } from '@/src/actions/getBookings'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { SafeBooking, SafeListing, SafeReview, SafeUser } from '@/src/types'
import { Button } from '../ui/button'

function safeToISOString(date: any): string {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString();
  }
  return new Date().toISOString();
}

function transformToSafeUser(user: any): SafeUser {
  if (!user) {
    return {
      id: '',
      name: null,
      email: null,
      profileImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: null,
      favoriteIds: [],
      role: 'USER',
      isTwoFactorEnabled: false,
      hashedPassword: null,
      isOAuth: false,
    };
  }

  return {
    id: user.id ?? '',
    name: user.name ?? null,
    email: user.email ?? null,
    profileImage: user.image ?? null,
    createdAt: safeToISOString(user.createdAt),
    updatedAt: safeToISOString(user.updatedAt),
    emailVerified: user.emailVerified ? safeToISOString(user.emailVerified) : null,
    favoriteIds: user.favoriteIds ?? [],
    role: user.role ?? 'USER',
    isTwoFactorEnabled: user.isTwoFactorEnabled ?? false,
    hashedPassword: user.hashedPassword ?? null,
    isOAuth: user.isOAuth ?? false,
  };
}

function transformToSafeListing(listing: any): SafeListing {
  if (!listing) {
    return {
      id: '',
      title: '',
      description: '',
      imageSrc: [],
      category: '',
      activityType: '',
      duration: 0,
      difficulty: '',
      minParticipants: 0,
      maxParticipants: 0,
      ageRestriction: null,
      equipment: [],
      locationName: '',
      locationAddress: '',
      latitude: 0,
      longitude: 0,
      price: 0,
      currency: 'EUR',
      isInstantBook: false,
      cancellationPolicy: '',
      viewCount: 0,
      bookingCount: 0,
      reviewCount: 0,
      reviewAverage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '',
      user: transformToSafeUser(null),
      bookings: [],
      reviews: [],
    };
  }

  return {
    id: listing.id ?? '',
    title: listing.title ?? '',
    description: listing.description ?? '',
    imageSrc: Array.isArray(listing.imageSrc) ? listing.imageSrc : [],
    category: listing.category ?? '',
    activityType: listing.activityType ?? '',
    duration: listing.duration ?? 0,
    difficulty: listing.difficulty ?? '',
    minParticipants: listing.minParticipants ?? 0,
    maxParticipants: listing.maxParticipants ?? 0,
    ageRestriction: listing.ageRestriction ?? null,
    equipment: Array.isArray(listing.equipment) ? listing.equipment : [],
    locationName: listing.locationName ?? '',
    locationAddress: listing.locationAddress ?? '',
    latitude: listing.latitude ?? 0,
    longitude: listing.longitude ?? 0,
    price: listing.price ?? 0,
    currency: listing.currency ?? 'EUR',
    isInstantBook: listing.isInstantBook ?? false,
    cancellationPolicy: listing.cancellationPolicy ?? '',
    viewCount: listing.viewCount ?? 0,
    bookingCount: listing.bookingCount ?? 0,
    reviewCount: listing.reviewCount ?? 0,
    reviewAverage: listing.reviewAverage ?? 0,
    createdAt: safeToISOString(listing.createdAt),
    updatedAt: safeToISOString(listing.updatedAt),
    userId: listing.userId ?? '',
    user: transformToSafeUser(listing.user),
    bookings: Array.isArray(listing.bookings) ? listing.bookings.map(transformToSafeBooking) : [],
    reviews: Array.isArray(listing.reviews) ? listing.reviews.map(transformToSafeReview) : [],
  };
}

function transformToSafeBooking(booking: any): SafeBooking {
  if (!booking) {
    return {
      id: '',
      listingId: '',
      userId: '',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      totalPrice: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), 
      status: 'PENDING',
      listing: null,
      user: transformToSafeUser(null),
      paymentIntentId: booking.paymentIntentId ?? null,
    };
  }

  return {
    id: booking.id ?? '',
    listingId: booking.listingId ?? '',
    userId: booking.userId ?? '',
    startDate: safeToISOString(booking.startDate),
    endDate: safeToISOString(booking.endDate),
    totalPrice: booking.totalPrice ?? 0,
    createdAt: safeToISOString(booking.createdAt),
    updatedAt: safeToISOString(booking.updatedAt), // Ajoutez cette ligne
    status: booking.status ?? 'PENDING',
    listing: booking.listing ? transformToSafeListing(booking.listing) : null,
    user: transformToSafeUser(booking.user),
    paymentIntentId: booking.paymentIntentId ?? null,
  };
}

function transformToSafeReview(review: any): SafeReview {
  if (!review) {
    return {
      id: '',
      listingId: '',
      userId: '',
      rating: 0,
      comment: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: transformToSafeUser(null),
      listing: null,
    };
  }

  return {
    id: review.id ?? '',
    listingId: review.listingId ?? '',
    userId: review.userId ?? '',
    rating: review.rating ?? 0,
    comment: review.comment ?? '',
    createdAt: safeToISOString(review.createdAt),
    updatedAt: safeToISOString(review.updatedAt),
    user: transformToSafeUser(review.user),
    listing: review.listing ? transformToSafeListing(review.listing) : null,
  };
}

export default function LatestBookings() {
  const [latestBookings, setLatestBookings] = useState<SafeBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const getBookings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const bookings = await fetchLatestBookings()
      console.log('Raw booking data:', bookings);
      const safeBookings: SafeBooking[] = bookings.map((booking: any) => {
        if (!booking) {
          return null;
        }
        return {
          ...booking,
          createdAt: safeToISOString(new Date(booking.createdAt)),
          updatedAt: safeToISOString(new Date(booking.updatedAt)),
          startDate: safeToISOString(new Date(booking.startDate)),
          endDate: safeToISOString(new Date(booking.endDate)),
          listing: transformToSafeListing(booking.listing),
          user: transformToSafeUser(booking.user),
          totalPrice: booking.totalPrice ?? 0,
          id: booking.id ?? '',
          userId: booking.userId ?? '',
          listingId: booking.listingId ?? '',
          status: booking.status ?? 'pending',
        };
      }).filter(Boolean);
      setLatestBookings(safeBookings)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to fetch bookings. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getBookings()
  }, [getBookings])

  const memoizedBookings = useMemo(() => latestBookings, [latestBookings])

  if (isLoading) {
    return <Card className="flex w-full flex-col md:col-span-4"><CardContent>Loading...</CardContent></Card>
  }

  if (error) {
    return (
      <Card className="flex w-full flex-col md:col-span-4">
        <CardContent>
          <p>{error}</p>
          <Button onClick={getBookings}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex w-full flex-col md:col-span-4">
      <CardHeader>
        <h2 className="mb-4 text-xl font-semibold md:text-2xl">
         Les dernières réservations
        </h2>
      </CardHeader>
      <CardContent>
        <div role="list" aria-label="Les dérnières réservations">
          {memoizedBookings.map((booking, i) => (
            <div
              key={booking.id}
              className={cn(
                'flex flex-row items-center justify-between py-4',
                { 'border-t': i !== 0 }
              )}
              role="listitem"
            >
              <div className="flex items-center">
              <Image
    src={booking.listing!.user.profileImage || '/images/unknown-profile-user.png'}
    alt={`${booking.listing!.user.name || 'User'}'s profile picture`}
    className="mr-4 rounded-full"
    width={32}
    height={32}
  />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {booking.listing!.user.name || 'Anonymous User'}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {booking.listing!.user.email || 'No email provided'}
                  </p>
                </div>
              </div>
              <p className="truncate text-sm font-medium md:text-base">
                {booking.totalPrice} {booking.listing!.currency} 
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <RefreshCcw className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">
            {lastUpdated 
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : 'Not yet updated'}
          </h3>
        </div>
      </CardContent>
    </Card>
  )
}