import prismadb from '@/src/lib/prismadb';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const { bookingId, status } = await req.json();

  try {
    await prismadb.payment.update({
      where: { bookingId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json({ error: 'Error updating payment status' }, { status: 500 });
  }
}