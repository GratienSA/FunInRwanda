"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios'; // Ajoutez cette ligne
import { SafeListing } from '@/src/types';
import getListingById from '@/src/actions/getListingById';
import Container from '@/src/components/Container';
import ClientOnly from '@/src/components/navbar/ClientOnly';
import EmptyState from '@/src/components/EmptyState';
import EditListingForm from '@/src/components/Elements/EditListingForm';

interface IParams {
  listingId: string;
}

// Ajoutez cette fonction
const updateListing = async (updatedListing: SafeListing) => {
  try {
    const response = await axios.put(`/api/listings/${updatedListing.id}`, updatedListing);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update listing');
  }
};

const EditListingPage = ({ params }: { params: IParams }) => {
  const [listing, setListing] = useState<SafeListing | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const fetchedListing = await getListingById(params);
        setListing(fetchedListing);
      } catch (error) {
        toast.error('Failed to fetch listing');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [params]);

  const handleSubmit = async (updatedListing: SafeListing) => {
    try {
      await updateListing(updatedListing);
      toast.success('Listing updated successfully');
      router.push(`/listings/${params.listingId}`);
    } catch (error) {
      toast.error('Failed to update listing');
    }
  };

  if (isLoading) {
    return (
      <ClientOnly>
        <Container>
          <div>Loading...</div>
        </Container>
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
      <Container>
        <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
        <EditListingForm listing={listing} onSubmit={handleSubmit} />
      </Container>
    </ClientOnly>
  );
};

export default EditListingPage;