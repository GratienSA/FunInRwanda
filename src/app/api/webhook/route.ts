import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import prismadb from '@/src/lib/prismadb';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-09-30.acacia', 
  });

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Mettez à jour la base de données avec les informations du paiement réussi
  const bookingId = paymentIntent.metadata.bookingId;

  try {
    await prismadb.payment.update({
      where: { bookingId },
      data: {
        status: 'succeeded',
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    await prismadb.booking.update({
      where: { id: bookingId },
      data: { status: 'confirmed' },
    });

    console.log(`Payment succeeded for booking ${bookingId}`);
  } catch (error) {
    console.error('Error updating payment status:', error);
  }
}