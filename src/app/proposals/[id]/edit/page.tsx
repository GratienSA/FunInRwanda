"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { BookingFormData, SafeListing, SafeUser } from '@/types';
import Container from '@/components/Container';
import ClientOnly from '@/components/navbar/ClientOnly';
import EmptyState from '@/components/EmptyState';
import EditListingForm from '@/components/Elements/EditListingForm';
import Heading from '@/components/Heading';

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
        toast.error("Erreur lors du chargement de l'annonce", {
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  const handleSubmit = async (formData: BookingFormData) => {
    if (!listing) return;

    try {
      const updatedListing: SafeListing = {
        ...listing,
        ...formData,
        id: listing.id,
        createdAt: listing.createdAt,
        userId: listing.userId,
      };
      await axios.put(`/api/listings/${params.id}`, updatedListing);
      toast.success("Annonce mise à jour avec succès", {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      router.push(`/proposals/${params.id}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'annonce", {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
    }
  };

  if (isLoading) {
    return (
      <ClientOnly>
        <Container>
          <div role="status" aria-live="polite">Chargement...</div>
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
        <div className="max-w-2xl mx-auto">
          <EditListingForm listing={listing} onSubmit={handleSubmit} />
        </div>
      </Container>
    </ClientOnly>
  );
};

export default EditProposalPage;