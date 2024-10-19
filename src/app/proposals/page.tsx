"use client";

import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/navbar/ClientOnly";
import ProposalsClient from "./ProposalsClient";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { SafeListing } from "../../types";

const ProposalsPage = () => {
  // Utilisation du hook personnalisé pour obtenir l'utilisateur courant
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();
  // État pour stocker les annonces
  const [listings, setListings] = useState<SafeListing[]>([]);
  // État pour gérer le chargement des annonces
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les annonces de l'utilisateur
    const fetchListings = async () => {
      if (currentUser && currentUser.id) {
        try {
          // Appel à l'API pour récupérer les annonces
          const response = await fetch(`/api/listings?userId=${currentUser.id}`);
          if (!response.ok) throw new Error('Failed to fetch listings');
          const data = await response.json();
          setListings(data);
        } catch (error) {
          console.error('Error fetching listings:', error);
        }
      }
      setLoading(false);
    };

    // Appel de fetchListings une fois que l'utilisateur est chargé
    if (!userLoading) {
      fetchListings();
    }
  }, [currentUser, userLoading]);

  // Affichage d'un loader pendant le chargement
  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  // Affichage d'un message si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorized"
          subtitle="Please login to view your proposals"
        />
      </ClientOnly>
    );
  }

  // Affichage d'un message si l'utilisateur n'a pas d'annonces
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No proposals found"
          subtitle="Looks like you haven't created any proposals yet."
        />
      </ClientOnly>
    );
  }

  // Affichage des annonces de l'utilisateur
  return (
    <ClientOnly>
      <ProposalsClient
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ProposalsPage;