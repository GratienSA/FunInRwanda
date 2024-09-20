"use client";

import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/navbar/ClientOnly";
import ProposalsClient from "./ProposalsClient";
import getListings from "../../actions/getListings";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { SafeListing } from "../../types";

const ProposalsPage = () => {
  const currentUser = useCurrentUser();
  const [listings, setListings] = useState<SafeListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (currentUser) {
        const fetchedListings = await getListings({ userId: currentUser.id });
        setListings(fetchedListings);
      }
      setLoading(false);
    };

    fetchListings();
  }, [currentUser]);

  if (loading) {
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