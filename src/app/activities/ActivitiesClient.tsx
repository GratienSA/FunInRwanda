"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import Container from "../../components/Container";
import Heading from "../../components/Heading";
import ListingCard from "../../components/listings/ListingCard";
import { SafeBooking, SafeUser } from "../../types";

interface ActivitiesClientProps {
  bookings: SafeBooking[];
  currentUser?: SafeUser | null;
}

const ActivitiesClient: React.FC<ActivitiesClientProps> = ({
  bookings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success('Reservation cancelled');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || 'Something went wrong');
      })
      .finally(() => {
        setDeletingId('');
      });
  }, [router]);

  return (
    <Container>
      <Heading
        title="Activities"
        subtitle="Your upcoming activities"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {bookings.length === 0 ? (
          <div className="text-center text-neutral-500">No activities found.</div>
        ) : (
          bookings.map((booking) => (
            <ListingCard
              key={booking.id}
              data={booking.listing}
              booking={booking}
              actionId={booking.id}
              onAction={onCancel}
              disabled={deletingId === booking.id}
              actionLabel="Cancel reservation"
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </Container>
  )
}

export default ActivitiesClient;