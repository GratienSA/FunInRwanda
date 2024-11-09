'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Range } from 'react-date-range';
import { SafeBooking, SafeListing, SafeUser } from '../../../types';
import useLoginModal from '../../../hooks/useLoginModal';
import { categories } from '../../../components/navbar/Categories';
import Container from '../../../components/Container';
import ListingInfo from '../../../components/listings/ListingInfo';
import ListingBooking from '../../../components/listings/ListingBooking';
import ListingHead from "../../../components/listings/ListingHead";

// Définition de la plage de dates initiale
const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
};

// Interface pour les props du composant
interface ListingClientProps {
    listing: SafeListing & {
      user: SafeUser;
    };
    currentUser?: SafeUser | null;
    bookings?: SafeBooking[];
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    bookings = [],
    currentUser,
}) => {
    const loginModal = useLoginModal();
    const router = useRouter(); 

    // Calcul des dates désactivées pour la réservation
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];
    
        if (Array.isArray(bookings)) {
            bookings.forEach((booking) => {
                if (booking.startDate && booking.endDate) {
                    const range = eachDayOfInterval({
                        start: new Date(booking.startDate),
                        end: new Date(booking.endDate),
                    });
                    dates = [...dates, ...range];
                }
            });
        }
    
        return dates;
    }, [bookings]);

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    // Fonction pour créer une réservation
    const onCreateBooking = useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        setIsLoading(true);
    
        try {
            const response = await axios.post('/api/reservations', {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing.id,
            });
    
            console.log('API response:', response.data);
    
            if (response.data.id) {
                toast.success('Réservation créée avec succès!');
                router.push(`/checkout/${response.data.id}/${listing.id}`);
            } else {
                toast.error('Impossible de créer la réservation.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || 'Une erreur est survenue.');
            } else {
                toast.error('Une erreur inattendue est survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [totalPrice, dateRange, listing?.id, currentUser, router, loginModal]);

    // Mise à jour du prix total lors du changement de dates
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    // Récupération de la catégorie de l'activité
    const category = useMemo(() => {
        return categories.find((items) => items.label === listing.category);
    }, [listing.category]);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc[0]}
                        locationValue={listing.locationName}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            activityType={listing.activityType}
                            duration={listing.duration}
                            difficulty={listing.difficulty}
                            minParticipants={listing.minParticipants}
                            maxParticipants={listing.maxParticipants}
                            ageRestriction={listing.ageRestriction as number}
                            equipment={listing.equipment}
                            locationName={listing.locationName}
                            locationAddress={listing.locationAddress}
                            latitude={listing.latitude}
                            longitude={listing.longitude}
                            isInstantBook={listing.isInstantBook}
                            cancellationPolicy={listing.cancellationPolicy}
                        />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingBooking
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateBooking}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ListingClient;