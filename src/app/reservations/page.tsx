"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import getBookings from "../../actions/getBookings";
import EmptyState from "../../components/EmptyState";
import ClientOnly from "../../components/navbar/ClientOnly";
import { SafeBooking } from "../../types";
import { toast } from "react-hot-toast";
import BookingsClient from "./BookingsClient ";


const BookingsPage = () => {
    const { user: currentUser, isLoading: userLoading } = useCurrentUser();
    const [bookings, setBookings] = useState<SafeBooking[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;
    const loadedPages = useRef(new Set<number>());
    const initialLoadDone = useRef(false);

    const fetchBookings = useCallback(async (pageToFetch: number) => {
        if (!currentUser?.id || loadedPages.current.has(pageToFetch)) return;

        setLoading(true);
        try {
            const { bookings: fetchedBookings, totalCount } = await getBookings({ 
                authorId: currentUser.id,
                page: pageToFetch,
                limit
            });
            setBookings(prevBookings => [...prevBookings, ...fetchedBookings]);
            setTotalCount(totalCount);
            loadedPages.current.add(pageToFetch);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [currentUser?.id, limit]);

    useEffect(() => {
        if (!userLoading && currentUser && !initialLoadDone.current) {
            fetchBookings(1);
            initialLoadDone.current = true;
        }
    }, [userLoading, currentUser, fetchBookings]);

    const loadMore = () => {
        if (bookings.length < totalCount) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchBookings(nextPage);
        }
    };

    if (userLoading) {
        return <ClientOnly><div>Loading...</div></ClientOnly>;
    }

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized"
                    subtitle="Please login to view your bookings"
                />
            </ClientOnly>
        );
    }

    if (bookings.length === 0 && !loading) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No bookings found"
                    subtitle="Looks like you haven't made any bookings yet."
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
            {bookings.length < totalCount && (
                <button onClick={loadMore} disabled={loading}>
                    Load More
                </button>
            )}
        </ClientOnly>
    );
};

export default BookingsPage;