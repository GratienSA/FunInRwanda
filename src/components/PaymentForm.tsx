'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

interface PaymentFormProps {
  amount: number;
  currency: string;
  bookingId: string;
}

export default function PaymentForm({ amount, currency, bookingId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé. Veuillez réessayer.");
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, bookingId }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'intention de paiement");
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Une erreur est survenue lors du paiement.');
      } else {
        setSucceeded(true);
        // Mise à jour du statut de paiement
        const updateResponse = await fetch('/api/update-payment-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId, status: 'succeeded' }),
        });

        if (!updateResponse.ok) {
          console.error('Erreur lors de la mise à jour du statut de paiement');
        }

        // Redirection vers une page de confirmation
        router.push('/confirmation');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue. Veuillez réessayer.');
      console.error('Erreur de paiement:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
          Informations de carte
        </label>
        <div id="card-element" className="p-3 border rounded-md">
          <CardElement options={{style: {base: {fontSize: '16px'}}}} />
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm mb-4" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={processing}
      >
        {processing ? 'Traitement...' : succeeded ? 'Payé' : `Payer ${amount} ${currency}`}
      </button>
      {succeeded && (
        <div className="text-green-500 text-sm mt-4" role="alert">
          Paiement réussi ! Redirection en cours...
        </div>
      )}
    </form>
  );
}