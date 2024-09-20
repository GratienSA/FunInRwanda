"use client";

import { useRouter } from "next/navigation";
import { SafeListing, SafeUser } from "../../types";
import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import Container from "../../components/Container";
import Heading from "../../components/Heading";
import ListingCard from "../../components/listings/ListingCard";

interface ProposalsClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const ProposalsClient: React.FC<ProposalsClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/listings/${id}`);
      toast.success('Listing cancelled');
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setDeletingId('');
    }
  }, [router]);

  return (
    <Container>
      <Heading
        title="Proposals"
        subtitle="List of your proposals"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.length === 0 ? (
          <div className="col-span-full text-center text-neutral-500">No proposals found.</div>
        ) : (
          listings.map((listing) => (
            <ListingCard
              key={listing.id}
              data={listing}
              actionId={listing.id}
              onAction={onCancel}
              disabled={deletingId === listing.id}
              actionLabel="Cancel listing"
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </Container>
  );
}

export default ProposalsClient;