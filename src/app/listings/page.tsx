"use client"
import { useEffect, useState } from "react";
import getBookings from "@/actions/getBookings";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/navbar/ClientOnly";
import ListingClient from "./[listingId]/ListingClient";
import { SafeListing, SafeBooking } from "@/types";

// Interface pour les paramètres d'URL
interface IParams {
  listingId?: string;
}

const ListingsPage = ({ params }: { params: IParams }) => {
  const [listing, setListing] = useState<SafeListing | null>(null);
  const [bookings, setBookings] = useState<SafeBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effet pour récupérer les données dès le chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les annonces et les réservations
        const fetchedListing = await getListingById(params);
        const fetchedBookings = await getBookings(params);
        setListing(fetchedListing);
        setBookings(fetchedBookings.bookings || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="flex items-center justify-center h-screen" aria-live="polite">
          <p className="text-lg">Chargement...</p>
        </div>
      </ClientOnly>
    );
  }

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
          <ListingClient listing={listing} bookings={bookings} />
        </main>
      </div>
    </ClientOnly>
  );
};

export default ListingsPage;

