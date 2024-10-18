"use client";

import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/navbar/ClientOnly";
import ProposalsClient from "./ProposalsClient";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { SafeListing } from "../../types";

const ProposalsPage = () => {
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();
  const [listings, setListings] = useState<SafeListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (currentUser && currentUser.id) {
        try {
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

    if (!userLoading) {
      fetchListings();
    }
  }, [currentUser, userLoading]);

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

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