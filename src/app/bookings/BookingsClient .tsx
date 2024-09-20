"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Container from "../../components/Container";
import Heading from "../../components/Heading";
import ListingCard from "../../components/listings/ListingCard";
import { SafeBooking, SafeUser } from "../../types";

interface BookingsClientProps {
  bookings: SafeBooking[];
  currentUser?: SafeUser | null;
}

const BookingsClient: React.FC<BookingsClientProps> = ({
  bookings,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success("Booking cancelled");
        router.refresh();
      })
      .catch((error) => {
        
        toast.error(error?.response?.data?.message || "Error cancelling booking");
      })
      .finally(() => {
        setDeletingId('');
      });
  }, [router]);

  return (
    <Container>
      <Heading
        title="Bookings"
        subtitle="Bookings on your activities"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookings.map((booking) => (
          <ListingCard
            key={booking.id}
            data={booking.listing}
            booking={booking}
            actionId={booking.id}
            onAction={onCancel}
            disabled={deletingId === booking.id} 
            actionLabel="Cancel guest booking"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default BookingsClient;