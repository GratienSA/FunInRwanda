
import { currentUser } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

interface IParams {
    listingId?: string;
}

// Ajoute un élément aux favoris
export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    // Récupère l'utilisateur actuel
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Vérifie la validité de l'ID
    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Met à jour les favoris
    let favoriteIds = [...(user.favoriteIds || [])];
    if (!favoriteIds.includes(listingId)) {
        favoriteIds.push(listingId);
    }

    try {
        await prismadb.user.update({
            where: { id: user.id },
            data: { favoriteIds },
        });
        return NextResponse.json({ message: 'Added to favorites' }, { status: 200 });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        return NextResponse.json({ message: 'Error adding to favorites' }, { status: 500 });
    }
}

// Supprime un élément des favoris
export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    // Récupère l'utilisateur actuel
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Vérifie la validité de l'ID
    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Met à jour les favoris
    let favoriteIds = [...(user.favoriteIds || [])];
    favoriteIds = favoriteIds.filter(id => id !== listingId);

    try {
        await prismadb.user.update({
            where: { id: user.id },
            data: { favoriteIds },
        });
        return NextResponse.json({ message: 'Removed from favorites' }, { status: 200 });
    } catch (error) {
        console.error("Error removing from favorites:", error);
        return NextResponse.json({ message: 'Error removing from favorites' }, { status: 500 });
    }
}
