"use client";

import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/navbar/ClientOnly";
import getReservations from "../../actions/getBookings";
import ActivitiesClient from "./ActivitiesClient";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { SafeBooking } from "../../types";

const ActivitiesPage = () => {
  const currentUser = useCurrentUser();
  const [bookings, setBookings] = useState<SafeBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (currentUser) {
        const fetchedBookings = await getReservations({ userId: currentUser.id });
        setBookings(fetchedBookings);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="You need to be logged in to view your activities"
          subtitle="Please log in to view your activities"
        />
      </ClientOnly>
    );
  }

  if (bookings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="You have no upcoming activities"
          subtitle="Looks like you haven't reserved any activities"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ActivitiesClient
        bookings={bookings}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ActivitiesPage;