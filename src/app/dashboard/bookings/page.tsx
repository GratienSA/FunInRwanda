import { BookingsTableSkeleton } from '@/components/bookings/skeletons'
import BookingsTable from '@/components/bookings/table'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { fetchFilteredBookings } from '@/actions/getBookings'
import { ReceivedBooking } from '@/types'

export const metadata: Metadata = {
  title: 'Bookings',
}

type SafeReceivedBooking = Omit<ReceivedBooking, 'user' | 'startDate' | 'endDate' | 'listing'> & {
  user: Omit<ReceivedBooking['user'], 'id'> & { id: string };
  startDate: Date;
  endDate: Date;
  listing: Omit<ReceivedBooking['listing'], 'id'> & { id: string };
};

function isValidBooking(booking: any): booking is SafeReceivedBooking {
  return booking && 
         booking.startDate instanceof Date && 
         booking.endDate instanceof Date &&
         booking.user &&
         typeof booking.user.id === 'string' &&
         booking.listing &&
         typeof booking.listing.id === 'string';
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  let bookings: SafeReceivedBooking[] = [];
  let error: string | undefined;
  let isLoading = true;

  try {
    const unfilteredBookings = await fetchFilteredBookings(query, currentPage);
    bookings = unfilteredBookings.filter((booking): booking is SafeReceivedBooking => {
      if (isValidBooking(booking)) {
        return true;
      }
      console.warn('Invalid booking:', booking);
      return false;
    });
    isLoading = false;
  } catch (e) {
    error = e instanceof Error ? e.message : 'An error occurred while fetching bookings';
    isLoading = false;
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Bookings</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Button asChild>
          <Link href="/dashboard/bookings/create">
            <span className="hidden md:block">Create Booking</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
      </div>
      <Suspense key={query + currentPage} fallback={<BookingsTableSkeleton />}>
        <BookingsTable 
          bookings={bookings as unknown as ReceivedBooking[]} 
          query={query} 
          currentPage={currentPage} 
          isLoading={isLoading} 
          error={error}
        />
      </Suspense>
    </div>
  )
}