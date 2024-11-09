"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios'; 
import { BookingFormData, SafeListing } from '@/types';
import getListingById from '@/actions/getListingById';
import Container from '@/components/Container';
import ClientOnly from '@/components/navbar/ClientOnly';
import EmptyState from '@/components/EmptyState';
import EditListingForm from '@/components/Elements/EditListingForm';

// Interface pour les paramètres de la page
interface IParams {
  listingId: string;
}

// Fonction pour mettre à jour l'annonce via l'API
const updateListing = async (updatedListing: SafeListing) => {
  try {
    const response = await axios.put(`/api/listings/${updatedListing.id}`, updatedListing);
    return response.data;
  } catch (error) {
    throw new Error('Échec de la mise à jour de l\'annonce');
  }
};

// Composant principal de la page d'édition d'annonce
const EditListingPage = ({ params }: { params: IParams }) => {
  // États pour gérer l'annonce et le chargement
  const [listing, setListing] = useState<SafeListing | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();

  // Effet pour charger les données de l'annonce au montage du composant
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const fetchedListing = await getListingById(params);
        setListing(fetchedListing);
      } catch (error) {
        toast.error('Échec du chargement de l\'annonce');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [params]);

  // Fonction pour gérer la soumission du formulaire d'édition
  const handleSubmit = async (formData: BookingFormData) => {
    try {
      if (listing) {
        // Fusion des données existantes avec les nouvelles données du formulaire
        const updatedListing: SafeListing = {
          ...listing,
          ...formData,
        };
  
        await updateListing(updatedListing);
        toast.success('Annonce mise à jour avec succès');
        router.push(`/listings/${params.listingId}`);
      } else {
        throw new Error('Listing not found');
      }
    } catch (error) {
      toast.error('Échec de la mise à jour de l\'annonce');
      console.error(error);
    }
  };

  // Affichage d'un état de chargement
  if (isLoading) {
    return (
      <ClientOnly>
        <Container>
          <div className="flex justify-center items-center h-screen" aria-live="polite">
            <p className="text-lg">Chargement...</p>
          </div>
        </Container>
      </ClientOnly>
    );
  }

  // Affichage d'un état vide si l'annonce n'est pas trouvée
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  // Rendu principal de la page d'édition
  return (
    <ClientOnly>
      <Container>
        <main className="py-8">
          <h1 className="text-2xl font-bold mb-6">Modifier l'annonce</h1>
          <EditListingForm listing={listing} onSubmit={handleSubmit} />
        </main>
      </Container>
    </ClientOnly>
  );
};

export default EditListingPage;