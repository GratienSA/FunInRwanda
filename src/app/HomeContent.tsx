'use client';

import React, { useState, useEffect } from 'react';
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


interface HomeContentProps {
    listings: SafeListing[];
    totalListings: number;
}

export default function HomeContent({ listings, totalListings }: HomeContentProps) {
    const currentUser = useCurrentUser();
    const [showDetailListing, setShowDetailListing] = useState(false);
    const [selectedListing, setSelectedListing] = useState<SafeListing | null>(null);
    const { getData } = useGetData();
    
    const [isClient, setIsClient] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Check for empty listings
    if (!Array.isArray(listings) || listings.length === 0) {
        return <EmptyState showReset />;
    }

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

    if (!isClient) {
        return null; // Or a fallback to avoid hydration errors
    }

    return (
        <div className="relative flex flex-col font-poppins text-[13px] text-primaryblack dark:text-slate-200">
            <div className="relative flex flex-col h-screen gap-12 px-4 overflow-y-scroll bg-white sm:gap-16 xl:gap-20 sm:px-10 dark:bg-primaryblack no-scrollbar lg:px-36">
                <Categories />
                <HeaderSection listings={listings} totalListings={totalListings} />
                <FacilitiesSection />
                <Container>
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    {loadingDetail && <div>Loading details...</div>}
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