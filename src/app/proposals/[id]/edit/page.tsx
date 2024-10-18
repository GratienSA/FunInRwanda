"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { SafeListing, SafeUser } from '@/src/types';
import Container from '@/src/components/Container';
import ClientOnly from '@/src/components/navbar/ClientOnly';
import EmptyState from '@/src/components/EmptyState';
import EditListingForm from '@/src/components/Elements/EditListingForm';
import Heading from '@/src/components/Heading';

interface IParams {
  id: string;
}

const EditProposalPage = ({ params }: { params: IParams }) => {
  const [listing, setListing] = useState<SafeListing | null>(null);
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/api/listings/${params.id}`);
        setListing(response.data.listing);
        setUser(response.data.user);
      } catch (error) {
        toast.error("Erreur lors du chargement de l'annonce");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  const handleSubmit = async (updatedListing: SafeListing) => {
    try {
      await axios.put(`/api/listings/${params.id}`, updatedListing);
      toast.success("Annonce mise à jour avec succès");
      router.push(`/proposals/${params.id}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'annonce");
    }
  };

  if (isLoading) {
    return (
      <ClientOnly>
        <Container>
          <div>Chargement...</div>
        </Container>
      </ClientOnly>
    );
  }

  if (!listing || !user) {
    return (
      <ClientOnly>
        <EmptyState
          title="Aucune annonce trouvée"
          subtitle="L'annonce que vous cherchez n'existe pas ou a été supprimée."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <Heading
          title="Modifier l'annonce"
          subtitle="Apportez des modifications à votre annonce"
        />
        <EditListingForm 
          listing={listing} 
          onSubmit={handleSubmit} 
        />
      </Container>
    </ClientOnly>
  );
};

export default EditProposalPage;