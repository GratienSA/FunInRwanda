"use client"

import getBookings from "@/actions/getBookings";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/navbar/ClientOnly";
import ListingClient from "./[listingId]/ListingClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  // Récupération asynchrone des données
  const listing = await getListingById(params);
  const bookings = await getBookings(params);
  const { user: currentUser, isLoading } = useCurrentUser();

  // Afficher un état de chargement pendant que les données sont récupérées
  if (isLoading) {
    return (
      <ClientOnly>
        <div className="flex items-center justify-center h-screen" aria-live="polite">
          <p className="text-lg">Chargement...</p>
        </div>
      </ClientOnly>
    );
  }

  // Afficher un état vide si aucune annonce n'est trouvée
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <main>
          <ListingClient
            listing={listing}
            currentUser={currentUser}
            bookings={bookings.bookings}
          />
        </main>
      </div>
    </ClientOnly>
  );
};

export default ListingPage;