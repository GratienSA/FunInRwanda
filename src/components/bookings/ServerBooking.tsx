import { Suspense } from 'react';
import BookingsTable from "@/components/bookings/table";
import { fetchFilteredBookings } from "@/actions/getBookings";
import { ReceivedBooking as ImportedReceivedBooking } from '@/types';

// Utilisez un type mapping pour rendre tous les champs de user et listing requis
type RequiredFields<T> = {
  [K in keyof T]-?: T[K];
};

type LocalReceivedBooking = Omit<ImportedReceivedBooking, 'user' | 'startDate' | 'endDate' | 'listing'> & {
  user: RequiredFields<ImportedReceivedBooking['user']>;
  startDate: Date;
  endDate: Date;
  listing: RequiredFields<ImportedReceivedBooking['listing']>;
};

async function ServerComponent({ query, currentPage }: { query: string, currentPage: number }) {
  const bookingsData = await fetchFilteredBookings(query, currentPage);
  
  const filteredBookings: LocalReceivedBooking[] = bookingsData
  .filter((booking): booking is NonNullable<typeof booking> => booking !== null)
  .map((booking) => ({
    ...booking,
    user: Object.fromEntries(
      Object.entries(booking.user).map(([key, value]) => [key, value ?? undefined])
    ) as RequiredFields<ImportedReceivedBooking['user']>,
    startDate: booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate),
    endDate: booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate),
    listing: Object.fromEntries(
      Object.entries(booking.listing).map(([key, value]) => [key, value ?? undefined])
    ) as RequiredFields<ImportedReceivedBooking['listing']>,
  }));
  
  return (
    <Suspense fallback={<div>Chargement des réservations...</div>}>
      <BookingsTable 
        bookings={filteredBookings} 
        query={query} 
        currentPage={currentPage} 
        isLoading={false}
      />
    </Suspense>
  );
}

export default ServerComponent;