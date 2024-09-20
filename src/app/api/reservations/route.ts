import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import prismadb from "@/src/lib/prismadb";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { listingId, startDate, endDate, totalPrice } = body;

    // Vérification des champs requis
    if (!listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validation des dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    if (start >= end) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    // Création de la réservation
    const listing = await prismadb.listing.update({
      where: { id: listingId },
      data: {
        bookings: {
          create: {
            startDate: start,
            endDate: end,
            totalPrice,
            userId: user.id
          }
        }
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
