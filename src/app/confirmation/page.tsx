'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface BookingDetails {
  id: string;
  totalPrice: number;
  status: string;
  listing: {
    title: string;
  };
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const bookingId = searchParams.get('bookingId')
    if (!bookingId) {
      setError("Numéro de réservation non trouvé")
      setLoading(false)
      return
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/reservations/${bookingId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la récupération des détails de la réservation');
        }
        const data = await response.json();
        setBookingDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails()

    const timer = setTimeout(() => {
      router.push('/')
    }, 30000)

    return () => clearTimeout(timer)
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-700">{error}</p>
          <Link href="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          Réservation confirmée !
        </h1>
        <div className="flex justify-center mb-4">
          <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {bookingDetails && (
          <div className="grid grid-cols-1 gap-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Numéro de réservation</p>
              <p className="text-lg text-gray-900">{bookingDetails.id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Montant total</p>
              <p className="text-lg text-gray-900">{bookingDetails.totalPrice.toFixed(2)} EUR</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <p className="text-lg text-gray-900">{bookingDetails.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Activité</p>
              <p className="text-lg text-gray-900">{bookingDetails.listing.title}</p>
            </div>
          </div>
        )}

        <p className="text-sm text-center text-gray-500 mb-6">
          Un email de confirmation vous sera envoyé sous peu.
        </p>

        <div className="flex justify-around mt-6 space-x-4">
          <Link href="/" className="flex-grow py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out">
            Retour à l'accueil
          </Link>
          <Link href="/reservations" className="flex-grow py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out">
            Voir mes réservations
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Vous serez automatiquement redirigé vers la page d'accueil dans quelques secondes.
          </p>
        </div>
      </div>
    </div>
  )
}