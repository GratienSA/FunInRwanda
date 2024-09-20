"use client";

import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/navbar/ClientOnly";
import FavoritesClient from "./FavoritesClient";
import { SafeListing } from "../../types";
import { getFavoriteListings } from "../../actions/getFavoriteListings";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

const convertToSafeListing = (listing: any): SafeListing => ({
  ...listing,
  createdAt: new Date(listing.createdAt).toISOString(),
  updatedAt: new Date(listing.updatedAt).toISOString(),
  user: {
    ...listing.user,
    createdAt: new Date(listing.user.createdAt).toISOString(),
    updatedAt: new Date(listing.user.updatedAt).toISOString(),
    emailVerified: listing.user.emailVerified ? new Date(listing.user.emailVerified).toISOString() : null,
  },
  bookings: [], 
  reviews: [], 
});

const FavoritesPage = () => {
    const currentUser = useCurrentUser();
    const [listings, setListings] = useState<SafeListing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (currentUser) {
                const rawListings = await getFavoriteListings(currentUser.id);
                const safeListings = rawListings.map(convertToSafeListing);
                setListings(safeListings);
            }
            setLoading(false);
        };

        fetchFavorites();
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized"
                    subtitle="Please login to view your favorites"
                />
            </ClientOnly>
        );
    }

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No favorites found"
                    subtitle="Looks like you have no favorite listings."
                />
            </ClientOnly>
        );
    } 
    
    return (
        <ClientOnly>
            <FavoritesClient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
}

export default FavoritesPage;