import getBookings from "@/src/actions/getBookings";
import getListingById from "@/src/actions/getListingById";
import EmptyState from "@/src/components/EmptyState";
import ClientOnly from "@/src/components/navbar/ClientOnly";
import ListingClient from "./[listingId]/ListingClient";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  const bookings = await getBookings(params);
  const currentUser = await useCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        currentUser={currentUser}
        bookings={bookings}
      />
    </ClientOnly>
  );
};

export default ListingPage;