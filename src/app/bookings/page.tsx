import getCurrentUser from "../actions/getCurrentUser";
import getBookings from "../actions/getBookings";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/navbar/ClientOnly";
import BookingsClient from "./BoookingsClient ";


const BookingsPage = async () => {
    const currentUser = await getCurrentUser();

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

    const bookings = await getBookings({
        authorId: currentUser.id
    });

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