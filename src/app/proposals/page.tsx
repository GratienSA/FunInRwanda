import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/navbar/ClientOnly";
import ProposalsClient from "./ProposalsClient";

import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";

const ProposalsPage = async () => {
  const currentUser = await getCurrentUser();

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

  const listings = await getListings({
    userId: currentUser.id
  });

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



