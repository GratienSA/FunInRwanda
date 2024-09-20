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

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
};

interface ListingClientProps {
    bookings?: SafeBooking[];
    listing: SafeListing;
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    bookings = [],
    currentUser,
}) => {
    const loginModal = useLoginModal();
    const router = useRouter();

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        bookings.forEach((booking) => {
            const range = eachDayOfInterval({
                start: new Date(booking.startDate),
                end: new Date(booking.endDate),
            });

            dates = [...dates, ...range];
        });

        return dates;
    }, [bookings]);

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateBooking = useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        setIsLoading(true);

        try {
            await axios.post('/api/bookings', {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing.id,
            });
            toast.success('Activity reserved!');
            setDateRange(initialDateRange);
            router.push('/trips');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || 'Something went wrong.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

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
                            ageRestriction={listing.ageRestriction}
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