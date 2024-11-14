import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import getListings, { IListingsParams } from '@/actions/getListings';
import { fetchUsers } from '@/actions/user';
import Breadcrumbs from '@/components/bookings/breadcrumbs';
import Loading from '@/app/loading';

export const metadata: Metadata = {
  title: 'Create Booking',
};

// Dynamically import BookingFormWrapper without SSR
const BookingFormWrapper = dynamic(() => import('@/components/bookings/BookingFormWrapper'), {
  ssr: false,
  loading: () => <Loading />,
});

export default async function CreateBookingPage() {
  const listingsParams: IListingsParams = {
    page: 1,
    limit: 50,
  };

  try {
    // Fetch users and listings concurrently
    const [users, listingsData] = await Promise.all([
      fetchUsers(),
      getListings(listingsParams),
    ]);

    // Destructure listings and totalCount from listingsData
    const { listings, totalCount } = listingsData;

    // Validate fetched data
    if (!Array.isArray(listings) || listings.length === 0) {
      return <div>No listings available. Please create some listings first.</div>;
    }

    if (!Array.isArray(users) || users.length === 0) {
      return <div>No users available. Please try again later.</div>;
    }

    // Render the main content
    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Bookings', href: '/dashboard/bookings' },
            {
              label: 'Create Booking',
              href: '/dashboard/bookings/create',
              active: true,
            },
          ]}
        />
        <BookingFormWrapper users={users} listings={listings} />
        <p>Total available listings: {totalCount}</p>
      </main>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Provide a user-friendly error message
    return <div>An error occurred while loading the data. Please try again later.</div>;
  }
}