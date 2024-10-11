"use client";

import { getFavoriteListings } from "@/src/actions/getFavoriteListings";
import EmptyState from "@/src/components/EmptyState";
import ClientOnly from "@/src/components/navbar/ClientOnly";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { SafeListing } from "@/src/types";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import FavoritesClient from "./FavoritesClient";


const FavoritesPage = () => {
    const { user: currentUser, isLoading: userLoading } = useCurrentUser();
    const [listings, setListings] = useState<SafeListing[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const favorites = await getFavoriteListings();
            setListings(favorites);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            toast.error("Failed to load favorites");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!userLoading) {
            fetchFavorites();
        }
    }, [userLoading, fetchFavorites]);

    if (userLoading || loading) {
        return <ClientOnly><div>Loading...</div></ClientOnly>;
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