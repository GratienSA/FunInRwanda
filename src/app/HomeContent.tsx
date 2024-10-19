'use client';

import React, { useState, useEffect } from 'react';
// Importations des composants et hooks nécessaires
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import ListingCard from '../components/listings/ListingCard';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { SafeListing } from '../types';
import useGetData from '../hooks/useGetData';
import HeaderSection from '../components/Fragments/HeaderSection';
import FacilitiesSection from '../components/Fragments/FacilitiesSection';
import FooterSection from '../components/Fragments/FooterSection';
import ModalDetailListing from '../components/Elements/ModalDetailListing ';
import Categories from '../components/navbar/Categories';

// Définition de l'interface pour les props du composant
interface HomeContentProps {
    listings: SafeListing[];
    totalListings: number;
}

export default function HomeContent({ listings, totalListings }: HomeContentProps) {
    // Hooks et états
    const { user: currentUser, isLoading } = useCurrentUser();
    const [showDetailListing, setShowDetailListing] = useState(false);
    const [selectedListing, setSelectedListing] = useState<SafeListing | null>(null);
    const { getData } = useGetData();
    
    const [isClient, setIsClient] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Effet pour gérer le rendu côté client
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (isLoading) {
        return <div>Chargement...</div>;
      }
    // Vérification des listings vides
    if (!Array.isArray(listings) || listings.length === 0) {
        return <EmptyState showReset />;
    }

    // Fonction pour afficher les détails d'une annonce
    const handleShowDetailListing = async (listingId: string) => {
        setLoadingDetail(true);
        try {
            await getData<{ data: SafeListing }>(`/api/listings/${listingId}`, (res) => {
                setSelectedListing(res.data.data);
            });
            setShowDetailListing(true);
        } catch (error) {
            console.error('Error fetching listing details:', error);
            setErrorMessage('Failed to load listing details. Please try again later.');
        } finally {
            setLoadingDetail(false);
        }
    };

    // Rendu conditionnel pour éviter les erreurs d'hydratation
    if (!isClient) {
        return null;
    }

    return (
        <div className="relative flex flex-col font-poppins text-[13px] text-primaryblack dark:text-slate-200">
           <div className="relative flex flex-col h-screen gap-8 px-4 overflow-y-scroll bg-white sm:gap-12 xl:gap-16 sm:px-10 dark:bg-primaryblack no-scrollbar lg:px-36">
            <div className="">
                <Categories />
                <HeaderSection listings={listings} totalListings={totalListings} />
                </div>
                <FacilitiesSection />
                <Container>
                    {errorMessage && <div role="alert" className="text-red-500">{errorMessage}</div>}
                    {loadingDetail && <div aria-live="polite">Loading details...</div>}
                    <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8 overflow-x-hidden">
                        {listings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                data={{
                                    ...listing,
                                    bookings: listing.bookings || [],
                                    reviews: listing.reviews || []
                                }}
                                currentUser={currentUser}
                                onClick={() => handleShowDetailListing(listing.id)}
                            />
                        ))}
                    </div>
                </Container>
                <FooterSection />
            </div>
            <ModalDetailListing
                showDetailListing={showDetailListing}
                setShowDetailListing={setShowDetailListing}
                selectedListing={selectedListing}
                setSelectedListing={setSelectedListing}
            />
        </div>
    );
}