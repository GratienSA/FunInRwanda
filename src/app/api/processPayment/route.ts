import { NextResponse } from 'next/server';
import prismadb from '@/src/lib/prismadb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia'
});

export async function POST(req: Request) {
  try {
    const { paymentMethodId, amount, bookingId, listingId, userId } = await req.json();

    // Validation des entrées
    if (!paymentMethodId || !amount || !bookingId || !listingId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Processing payment for booking ${bookingId}`);

    // Utilisation d'une transaction Prisma
    const result = await prismadb.$transaction(async (prisma) => {
      // Trouver ou créer StripeCustomer
      let stripeCustomer = await prisma.stripeCustomer.findUnique({
        where: { userId: userId }
      });

      if (!stripeCustomer) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new Error("User not found");
        }

        const customer = await stripe.customers.create({
          email: user.email!,
          name: user.name || undefined,
        });

        stripeCustomer = await prisma.stripeCustomer.create({
          data: {
            userId: userId,
            stripeCustomerId: customer.id,
          }
        });
      }

      console.log(`Using Stripe customer: ${stripeCustomer.stripeCustomerId}`);

      // Créer et confirmer PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'eur',
        customer: stripeCustomer.stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?bookingId=${bookingId}`,
        metadata: { bookingId, listingId },
      });

      console.log(`Payment intent created: ${paymentIntent.id}`);

      // Mettre à jour le statut de la réservation
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: paymentIntent.status === 'succeeded' ? 'paid' : 'payment_failed' },
      });

      // Créer un enregistrement de paiement
      await prisma.payment.create({
        data: {
          bookingId,
          amount,
          currency: 'eur',
          stripeCustomerId: stripeCustomer.stripeCustomerId,
          stripePaymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
        },
      });

      return { 
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status
      };
    });

    console.log(`Payment processing completed for booking ${bookingId}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing payment:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}