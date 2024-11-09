
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia", 
});

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { amount, currency, bookingId, orderId, userId } = body;

    if (!amount || !currency || !bookingId || !orderId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Récupérer ou créer un client Stripe
    let stripeCustomer = await prismadb.stripeCustomer.findUnique({
      where: { userId: userId },
    });

    if (!stripeCustomer) {
      const user = await prismadb.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
      });

      stripeCustomer = await prismadb.stripeCustomer.create({
        data: {
          userId: userId,
          stripeCustomerId: customer.id,
        },
      });
    }

    // Créer l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe utilise les centimes
      currency: currency,
      customer: stripeCustomer.stripeCustomerId,
      metadata: { bookingId, orderId },
    });

    // Créer un enregistrement de paiement dans la base de données
    await prismadb.payment.create({
      data: {
        amount: amount,
        currency: currency,
        status: 'pending',
        bookingId: bookingId,
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}