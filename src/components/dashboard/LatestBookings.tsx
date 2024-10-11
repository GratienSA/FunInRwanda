import Image from 'next/image'
import { RefreshCcw } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { Card, CardContent, CardHeader } from '../ui/card'
import { fetchLatestBookings } from '@/src/actions/getBookings'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { SafeBooking, SafeListing, SafeUser } from '@/src/types'
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
      image: null,
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
    image: user.image ?? null,
    createdAt: safeToISOString(new Date(user.createdAt)),
    updatedAt: safeToISOString(new Date(user.updatedAt)),
    emailVerified: user.emailVerified ? safeToISOString(new Date(user.emailVerified)) : null,
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
      imageSrc: '',
      createdAt: new Date().toISOString(),
      category: '',
      roomCount: 0,
      bathroomCount: 0,
      guestCount: 0,
      locationValue: '',
      userId: '',
      price: 0,
      user: transformToSafeUser(null),
      bookings: [],
      reviews: [],
    };
  }

  return {
    ...listing,
    createdAt: safeToISOString(new Date(listing.createdAt)),
    updatedAt: safeToISOString(new Date(listing.updatedAt)),
    user: transformToSafeUser(listing.user),
    bookings: listing.bookings ?? [],
    reviews: listing.reviews ?? [],
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
          Latest Bookings
        </h2>
      </CardHeader>
      <CardContent>
        <div role="list" aria-label="Latest bookings">
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
                  src={booking.listing.user.image || '/default-avatar.png'}
                  alt={`${booking.listing.user.name || 'User'}'s profile picture`}
                  className="mr-4 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {booking.listing.user.name || 'Anonymous User'}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {booking.listing.user.email || 'No email provided'}
                  </p>
                </div>
              </div>
              <p className="truncate text-sm font-medium md:text-base">
                {booking.totalPrice} {booking.listing.currency} EUR
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