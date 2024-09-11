import { Suspense } from 'react';
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getBookings from '@/app/actions/getBookings';
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/navbar/ClientOnly";
import ListingClient from './ListingClient';
import Loader from '@/app/components/Loader';

interface IParams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
    const listing = await getListingById(params);

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    const bookings = await getBookings(params);
    const currentUser = await getCurrentUser();

    return (
        <ClientOnly>
            <Suspense fallback={<Loader />}>
                <ListingClient
                    listing={listing}
                    currentUser={currentUser}
                    bookings={bookings}
                />
            </Suspense>
        </ClientOnly>
    );
};

export default ListingPage;

