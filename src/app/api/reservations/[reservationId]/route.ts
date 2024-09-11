import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
    reservationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
        throw new Error('Invalid reservation ID');
    }

    try {
        const reservation = await prisma.booking.deleteMany({
            where: {
                id: reservationId,
                OR: [
                    { userId: currentUser.id },
                    { listing: { userId: currentUser.id } }
                ]
            }
        });

        if (reservation.count === 0) {
            return NextResponse.json({ error: "Reservation not found or you don't have permission to delete it" }, { status: 404 });
        }

        return NextResponse.json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return NextResponse.json({ error: "An error occurred while deleting the reservation" }, { status: 500 });
    }
}