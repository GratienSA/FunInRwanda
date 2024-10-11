import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/src/components/bookings/breadcrumbs'
import EditBookingForm from '@/src/components/bookings/editForm'
import getListings, { IListingsParams } from '@/src/actions/getListings'
import { fetchUsers } from '@/src/actions/user'
import { fetchBookingById } from '@/src/actions/getBookings'
import { FormattedBooking, SafeBooking } from '@/src/types'

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
    startDate: new Date(booking.startDate).toISOString(),  // Convertir en string
    endDate: new Date(booking.endDate).toISOString(),      // Convertir en string
    createdAt: new Date(booking.createdAt).toISOString(),  // Convertir en string
    updatedAt: new Date(booking.updatedAt).toISOString(),  // Convertir en string
    user: {
      ...booking.user,
      emailVerified: booking.user.emailVerified ? new Date(booking.user.emailVerified).toISOString() : null,
      createdAt: new Date(booking.user.createdAt).toISOString(), // Convertir en string
      updatedAt: new Date(booking.user.updatedAt).toISOString(), // Convertir en string
    },
    listing: {
      ...booking.listing,
      createdAt: new Date(booking.listing.createdAt).toISOString(), // Convertir en string
      updatedAt: new Date(booking.listing.updatedAt).toISOString(), // Convertir en string
      user: {
        ...booking.listing.user,
        emailVerified: booking.listing.user.emailVerified ? new Date(booking.listing.user.emailVerified).toISOString() : null,
        createdAt: new Date(booking.listing.user.createdAt).toISOString(), // Convertir en string
        updatedAt: new Date(booking.listing.user.updatedAt).toISOString(), // Convertir en string
      },
      bookings: booking.listing.bookings.map(b => ({
        ...b,
        startDate: new Date(b.startDate).toISOString(), // Convertir en string
        endDate: new Date(b.endDate).toISOString(),     // Convertir en string
        createdAt: new Date(b.createdAt).toISOString(), // Convertir en string
        updatedAt: new Date(b.updatedAt).toISOString(), // Convertir en string
      })),
      reviews: booking.listing.reviews.map(r => ({
        ...r,
        createdAt: new Date(r.createdAt).toISOString(), // Convertir en string
        updatedAt: new Date(r.updatedAt).toISOString(), // Convertir en string
      })),
    },
  }
  
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
        booking={formattedBooking} 
        users={users} 
        listings={listings}
      />
    </main>
  )
}
