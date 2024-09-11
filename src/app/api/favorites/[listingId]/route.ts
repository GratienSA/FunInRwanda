import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];

    if (!favoriteIds.includes(listingId)) {
        favoriteIds.push(listingId);
    }

    try {
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { favoriteIds },
        });

        return NextResponse.json({ message: 'Added to favorites' }, { status: 200 });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        return NextResponse.json({ message: 'Error adding to favorites' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];

    favoriteIds = favoriteIds.filter(id => id !== listingId);

    try {
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { favoriteIds },
        });

        return NextResponse.json({ message: 'Removed from favorites' }, { status: 200 });
    } catch (error) {
        console.error("Error removing from favorites:", error);
        return NextResponse.json({ message: 'Error removing from favorites' }, { status: 500 });
    }
}