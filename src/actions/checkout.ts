import prismadb from '../lib/prismadb';
import { stripe } from '../lib/stripe';

interface CheckoutData {
  paymentMethodId: string;
  amount: number;
  currency: string;
  description: string;
  bookingId: string;
}

export async function checkoutAction(data: CheckoutData) {
  try {
    // Créer l'intention de paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      payment_method: data.paymentMethodId,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      // Enregistrer le paiement dans votre base de données
      await prismadb.payment.create({
        data: {
          amount: data.amount,
          currency: data.currency,
          status: 'succeeded',
          stripePaymentIntentId: paymentIntent.id,
          bookingId: data.bookingId,
      
        },
      });

      return { success: true };
    } else {
      return { success: false, error: 'Le paiement a échoué' };
    }
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    return { success: false, error: 'Une erreur est survenue lors du traitement du paiement' };
  }
}