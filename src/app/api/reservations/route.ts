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
    const newBooking = await prismadb.booking.create({
      data: {
        startDate: start,
        endDate: end,
        totalPrice,
        userId: user.id,
        listingId: listingId,
        status: "pending"
      },
      include: {
        listing: {
          select: {
            title: true,
            price: true
          }
        }
      }
    });

    console.log('New booking created:', newBooking);

    return NextResponse.json({
      id: newBooking.id,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      totalPrice: newBooking.totalPrice,
      listingId: newBooking.listingId,
      listingTitle: newBooking.listing.title,
      listingPrice: newBooking.listing.price
    });

  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    // Récupérer les 5 activités les plus réservées
    const topActivities = await prismadb.listing.findMany({
      select: {
        id: true,
        title: true,
        imageSrc: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: {
        bookings: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Formater les résultats
    const formattedTopActivities = topActivities.map(activity => ({
      id: activity.id,
      title: activity.title,
      imageSrc: activity.imageSrc[0], 
      bookingCount: activity._count.bookings
    }));

    return NextResponse.json(formattedTopActivities);
  } catch (error) {
    console.error("Error fetching top activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}