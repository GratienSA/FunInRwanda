import { NextResponse } from 'next/server';
import prismadb from '@/src/lib/prismadb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');

  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  try {
    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
      select: { totalPrice: true }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ amount: booking.totalPrice });
  } catch (error) {
    console.error('Error fetching amount:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}