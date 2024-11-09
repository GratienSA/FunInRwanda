'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { toast } from 'react-hot-toast'
import { currentUser } from '@/src/lib/auth'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ bookingId, listingId, amount }: { bookingId: string; listingId: string; amount: number }) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
  
    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé. Veuillez réessayer.")
      setIsSubmitting(false)
      return
    }
  
    const cardElement = elements.getElement(CardElement)
  
    if (!cardElement) {
      setError("Impossible de trouver l'élément de carte. Veuillez réessayer.")
      setIsSubmitting(false)
      return
    }
  
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })
  
      if (error) {
        throw new Error(error.message)
      }
  
      if (!paymentMethod) {
        throw new Error("Impossible de créer la méthode de paiement")
      }
  
      const user = await currentUser()
      if (!user) {
        throw new Error("Utilisateur non authentifié")
      }
  
      const response = await fetch('/api/processPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount,
          bookingId,
          listingId,
          userId: user.id
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Payment failed')
      }
  
      const { clientSecret, status } = await response.json()
  
      if (status === 'succeeded') {
        toast.success('Paiement réussi!')
        router.push(`/confirmation?bookingId=${bookingId}`)
      } else {
        setError("Le paiement n'a pas pu être complété. Veuillez réessayer.")
      }
    } catch (err) {
      console.error('Error processing payment:', err)
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
          Informations de carte
        </label>
        <div className="border border-gray-300 rounded-md p-3">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={isSubmitting || !stripe}
      >
        {isSubmitting ? 'Traitement en cours...' : `Payer ${(amount).toFixed(2)} EUR`}
      </button>
    </form>
  )
}

export function CheckoutPageContent({ bookingId, listingId }: { bookingId: string; listingId: string }) {
  const [amount, setAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAmount() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getAmount?bookingId=${bookingId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
        }
        const data = await response.json();
        setAmount(data.amount);
      } catch (err) {
        console.error('Error fetching amount:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching the amount.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAmount()
  }, [bookingId])

  if (isLoading) return <div className="text-center">Chargement des informations de paiement...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>
  if (!amount) return <div className="text-center">Impossible de charger le montant du paiement.</div>

  const options: StripeElementsOptions = {
    clientSecret: process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET,
    appearance: { theme: 'stripe' },
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-5 text-center">Paiement pour la réservation</h1>
      <p className="mb-4 text-center text-gray-600">Réservation ID: {bookingId}</p>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm bookingId={bookingId} listingId={listingId} amount={amount} />
      </Elements>
    </div>
  )
}