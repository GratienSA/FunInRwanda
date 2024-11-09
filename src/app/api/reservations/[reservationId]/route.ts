import { currentUser } from "@/src/lib/auth";
import prismadb from "@/src/lib/prismadb";
import { NextResponse } from "next/server";

interface IParams {
    reservationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
        return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
    }

    try {
        const result = await prismadb.booking.deleteMany({
            where: {
                id: reservationId,
                OR: [
                    { userId: user.id },
                    { listing: { userId: user.id } }
                ]
            }
        });

        if (result.count === 0) {
            return NextResponse.json({ error: "Reservation not found or you don't have permission to delete it" }, { status: 404 });
        }

        return NextResponse.json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return NextResponse.json({ error: "An error occurred while deleting the reservation" }, { status: 500 });
    }
}

interface IParams {
    reservationId?: string;
  }

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
        return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    try {
        const booking = await prismadb.booking.findUnique({
            where: {
                id: reservationId
            },
            include: {
                listing: {
                    select: {
                        title: true,
                        userId: true
                    }
                }
            }
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Vérifier si l'utilisateur a le droit de voir cette réservation
        if (booking.userId !== user.id && booking.listing.userId !== user.id) {
            return NextResponse.json({ error: "You don't have permission to view this booking" }, { status: 403 });
        }

        // Formater la réponse pour ne pas exposer d'informations sensibles
        const formattedBooking = {
            id: booking.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            status: booking.status,
            createdAt: booking.createdAt,
            listing: {
                title: booking.listing.title
            }
        };

        return NextResponse.json(formattedBooking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        return NextResponse.json({ error: "An error occurred while fetching the booking" }, { status: 500 });
    }
}