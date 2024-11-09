import { Suspense } from 'react';
import { Metadata } from 'next';
import getListings, { IListingsParams } from '@/actions/getListings';
import { fetchUsers } from '@/actions/user';
import Breadcrumbs from '@/components/bookings/breadcrumbs';
import BookingForm from '@/components/bookings/createForm';
import { SafeListing, SafeUser } from '@/types';
import Loading from '@/app/loading';

export const metadata: Metadata = {
  title: 'Create Booking',
};

type BookingFormProps = {
  users: SafeUser[];
  listings: SafeListing[];
};

const BookingFormWrapper: React.FC<BookingFormProps> = ({ users, listings }) => (
  <Suspense fallback={<Loading />}>
    <BookingForm users={users} listings={listings} />
  </Suspense>
);

export default async function CreateBookingPage() {
  const listingsParams: IListingsParams = {
    page: 1,
    limit: 50,
  };

  try {
    const [users, listingsData] = await Promise.all([
      fetchUsers(),
      getListings(listingsParams),
    ]);

    const { listings, totalCount } = listingsData;

    if (listings.length === 0) {
      return <div>No listings available. Please create some listings first.</div>;
    }

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
    return <div>An error occurred while loading the data. Please try again later.</div>;
  }
}