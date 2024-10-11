"use client";

import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import getBookings from "@/src/actions/getBookings";
import getListingById from "@/src/actions/getListingById";
import EmptyState from "@/src/components/EmptyState";
import ClientOnly from "@/src/components/navbar/ClientOnly";
import ListingClient from "./ListingClient";
import { useEffect, useState } from "react";
import { SafeListing, SafeBooking } from "@/src/types"; 

interface IParams {
  listingId: string;
}

const ListingPage = ({ params }: { params: IParams }) => {
  const [listing, setListing] = useState<SafeListing | null>(null);
  const [bookings, setBookings] = useState<SafeBooking[]>([]);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedListing = await getListingById(params);
      const fetchedBookings = await getBookings(params);
      setListing(fetchedListing);
      setBookings(fetchedBookings);
    };
    fetchData();
  }, [params]);

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