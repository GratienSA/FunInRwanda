import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/src/components/bookings/breadcrumbs'
import EditBookingForm from '@/src/components/bookings/editForm'
import getListings, { IListingsParams } from '@/src/actions/getListings'
import { fetchUsers } from '@/src/actions/user'
import { fetchBookingById } from '@/src/actions/getBookings'
import { FormattedBooking, SafeBooking, ExtendedReceivedBooking } from '@/src/types'

export const metadata: Metadata = {
  title: 'Edit Booking',
}

const defaultListingsParams: IListingsParams = {}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  
  const [bookingResult, users, listingsData] = await Promise.all([
    fetchBookingById(id),
    fetchUsers(),
    getListings(defaultListingsParams),
  ])

  if (!bookingResult) {
    notFound()
  }

  const booking: SafeBooking = bookingResult
  const { listings } = listingsData

  const formattedBooking: FormattedBooking = {
    ...booking,
    startDate: new Date(booking.startDate).toISOString(),
    endDate: new Date(booking.endDate).toISOString(),
    createdAt: new Date(booking.createdAt).toISOString(),
    updatedAt: new Date(booking.updatedAt).toISOString(),
    user: {
      ...booking.user,
      emailVerified: booking.user.emailVerified ? new Date(booking.user.emailVerified).toISOString() : null,
      createdAt: new Date(booking.user.createdAt).toISOString(),
      updatedAt: new Date(booking.user.updatedAt).toISOString(),
    },
    listing: booking.listing ? {
      ...booking.listing,
      createdAt: new Date(booking.listing.createdAt).toISOString(),
      updatedAt: new Date(booking.listing.updatedAt).toISOString(),
      user: {
        ...booking.listing.user,
        emailVerified: booking.listing.user.emailVerified ? new Date(booking.listing.user.emailVerified).toISOString() : null,
        createdAt: new Date(booking.listing.user.createdAt).toISOString(),
        updatedAt: new Date(booking.listing.user.updatedAt).toISOString(),
      },
      bookings: (booking.listing.bookings || []).map(b => ({
        ...b,
        startDate: new Date(b.startDate).toISOString(),
        endDate: new Date(b.endDate).toISOString(),
        createdAt: new Date(b.createdAt).toISOString(),
        updatedAt: new Date(b.updatedAt).toISOString(),
      })),
      reviews: (booking.listing.reviews || []).map(r => ({
        ...r,
        createdAt: new Date(r.createdAt).toISOString(),
        updatedAt: new Date(r.updatedAt).toISOString(),
      })),
    } : null,
  };


  // Convertir les chaînes ISO en objets Date pour ReceivedBooking
  const receivedBooking: ExtendedReceivedBooking = {
    ...formattedBooking,
    startDate: formattedBooking.startDate ? new Date(formattedBooking.startDate) : null,
    endDate: formattedBooking.endDate ? new Date(formattedBooking.endDate) : null,
    createdAt: new Date(formattedBooking.createdAt),
    updatedAt: new Date(formattedBooking.updatedAt),
    user: {
      ...formattedBooking.user,
      id: formattedBooking.user.id,
      emailVerified: formattedBooking.user.emailVerified ? new Date(formattedBooking.user.emailVerified) : null,
      createdAt: new Date(formattedBooking.user.createdAt),
      updatedAt: new Date(formattedBooking.user.updatedAt),
      isOAuth: formattedBooking.user.hashedPassword === null,
    },
    listing: formattedBooking.listing ? {
      id: formattedBooking.listing.id,
      title: formattedBooking.listing.title,
      createdAt: new Date(formattedBooking.listing.createdAt),
      updatedAt: new Date(formattedBooking.listing.updatedAt),
      user: {
        id: formattedBooking.listing.user.id,
        name: formattedBooking.listing.user.name,
        email: formattedBooking.listing.user.email,
        emailVerified: formattedBooking.listing.user.emailVerified ? new Date(formattedBooking.listing.user.emailVerified) : null,
        createdAt: new Date(formattedBooking.listing.user.createdAt),
        updatedAt: new Date(formattedBooking.listing.user.updatedAt),
        role: formattedBooking.listing.user.role,
        profileImage: formattedBooking.listing.user.profileImage,
        favoriteIds: formattedBooking.listing.user.favoriteIds,
        isTwoFactorEnabled: formattedBooking.listing.user.isTwoFactorEnabled,
        isOAuth: formattedBooking.listing.user.hashedPassword === null,
      },
      bookings: formattedBooking.listing.bookings.map(b => ({
        id: b.id,
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
        status: b.status,
      })),
      reviews: formattedBooking.listing.reviews.map(r => ({
        id: r.id,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      })),
    } : {
      // Fournir des valeurs par défaut si listing est null
      id: '',
      title: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: '',
        name: null,
        email: null,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'USER', 
        profileImage: null,
        favoriteIds: [],
        isTwoFactorEnabled: false,
        isOAuth: false,
      },
      bookings: [],
      reviews: [],
    },
  };
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Bookings', href: '/dashboard/bookings' },
          {
            label: 'Edit Booking',
            href: `/dashboard/bookings/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditBookingForm 
        booking={receivedBooking} 
        users={users} 
        listings={listings}
      />
    </main>
  )
}
