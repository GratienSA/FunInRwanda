"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import getBookings from "@/actions/getBookings";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/navbar/ClientOnly";
import ListingClient from "./ListingClient";
import { SafeListing, SafeBooking } from "@/types"; 

// Définition de l'interface pour les paramètres
interface IParams {
  listingId: string;
}

const ListingPage = ({ params }: { params: IParams }) => {
  // États pour gérer les données et le chargement
  const [listing, setListing] = useState<SafeListing | null>(null);
  const [bookings, setBookings] = useState<SafeBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Récupération de l'utilisateur courant
  const { user: currentUser } = useCurrentUser();

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupération de l'annonce et des réservations
        const fetchedListing = await getListingById(params);
        const fetchedBookings = await getBookings(params);
        setListing(fetchedListing);
        setBookings(fetchedBookings.bookings || []); 
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        // TODO: Ajouter une gestion d'erreur plus robuste ici
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params]);

  // Affichage d'un état de chargement
  if (isLoading) {
    return (
      <ClientOnly>
        {/* Utilisation de aria-live pour l'accessibilité */}
        <div className="flex items-center justify-center h-screen" aria-live="polite">
          <p className="text-lg">Chargement...</p>
        </div>
      </ClientOnly>
    );
  }

  // Affichage d'un état vide si aucune annonce n'est trouvée
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  // Rendu principal de la page
  return (
    <ClientOnly>
      {/* Conteneur responsive */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <main>
          <ListingClient
            listing={listing}
            currentUser={currentUser}
            bookings={bookings}
          />
        </main>
      </div>
    </ClientOnly>
  );
};

export default ListingPage;