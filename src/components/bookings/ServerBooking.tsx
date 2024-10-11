import { Suspense } from 'react';
import BookingsTable from "@/src/components/bookings/table";
import { fetchFilteredBookings } from "@/src/actions/getBookings";
import { ReceivedBooking } from '@/src/types';


async function ServerComponent({ query, currentPage }: { query: string, currentPage: number }) {
  const bookingsData = await fetchFilteredBookings(query, currentPage);
  
  // Filtrer les éléments null
  const filteredBookings: ReceivedBooking[] = bookingsData.filter((booking): booking is ReceivedBooking => booking !== null);
  
  return (
    <Suspense fallback={<div>Chargement des réservations...</div>}>
      <BookingsTable bookings={filteredBookings} query={query} currentPage={currentPage} />
    </Suspense>
  );
}

export default ServerComponent;