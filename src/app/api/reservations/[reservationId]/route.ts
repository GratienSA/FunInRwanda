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
