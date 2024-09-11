import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/navbar/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getBookings";
import ActivitiesClient from "./ActivitiesClient";

const ActivitiesPage = async () => {
  const currentUser = await getCurrentUser();

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

  const bookings = await getReservations({
    userId: currentUser.id
  });

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


