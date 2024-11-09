'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

import Container from '../../components/Container'
import Heading from '../../components/Heading'
import ListingCard from '../../components/listings/ListingCard'
import { SafeBooking, SafeUser } from '../../types'

// Définition des props du composant
interface BookingsClientProps {
    bookings: SafeBooking[]
    currentUser?: SafeUser | null
}

const BookingsClient: React.FC<BookingsClientProps> = ({
    bookings,
    currentUser,
}) => {
    const router = useRouter()
    // État pour suivre l'ID de la réservation en cours d'annulation
    const [deletingId, setDeletingId] = useState('')

    // Fonction pour annuler une réservation
    const onCancel = useCallback(
        (id: string) => {
            setDeletingId(id)

            axios
                .delete(`/api/reservations/${id}`)
                .then(() => {
                    toast.success('Booking cancelled')
                    router.refresh() // Rafraîchit la page pour mettre à jour les données
                })
                .catch((error) => {
                    // Affiche un message d'erreur personnalisé ou par défaut
                    toast.error(
                        error?.response?.data?.message ||
                            'Error cancelling booking'
                    )
                })
                .finally(() => {
                    setDeletingId('') // Réinitialise l'ID de suppression
                })
        },
        [router]
    )

    return (
        <Container>
            <Heading title="Mes réservations" subtitle='Mes réservations passées'/> 
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookings
                    .filter((booking) => booking.listing)
                    .map((booking) => (
                        <ListingCard
                            key={booking.id}
                            data={booking.listing!}
                            booking={booking}
                            actionId={booking.id}
                            onAction={onCancel}
                            disabled={deletingId === booking.id}
                            actionLabel="Annuler la reservation"
                            currentUser={currentUser}
                        />
                    ))}
            </div>
        </Container>
    )
}

export default BookingsClient
