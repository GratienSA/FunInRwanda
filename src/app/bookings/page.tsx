"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import getBookings from "../../actions/getBookings";
import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/navbar/ClientOnly";

import { SafeBooking } from "../../types"; 
import BookingsClient from "./BookingsClient ";

const BookingsPage = () => {
    const currentUser = useCurrentUser();
    const [bookings, setBookings] = useState<SafeBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (currentUser) {
                const fetchedBookings = await getBookings({ authorId: currentUser.id });
                setBookings(fetchedBookings);
            }
            setLoading(false);
        };

        fetchBookings();
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="You need to be logged in to view your bookings"
                    subtitle="Please login"
                />
            </ClientOnly>
        );
    }

    if (bookings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="You have no bookings"
                    subtitle="Please make a booking"
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <BookingsClient 
                bookings={bookings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default BookingsPage;