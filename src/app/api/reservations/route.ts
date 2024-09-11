import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; 

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  try {
    const body = await req.json();
    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listingAndReservation = await prisma.listing.update({
      where: {
        id: listingId
      },
      data: {
        bookings: {
          create: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice,
            userId: currentUser.id
          }
        }
      }
    });

    return NextResponse.json(listingAndReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}