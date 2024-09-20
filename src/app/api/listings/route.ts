import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import prismadb from "@/src/lib/prismadb";

export async function POST(
    request: Request,
) {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
        title,
        description,
        imageSrc,
        category,
        activityType,
        duration,
        difficulty,
        minParticipants,
        maxParticipants,
        ageRestriction,
        equipment,
        locationName,
        locationAddress,
        latitude,
        longitude,
        price,
        currency,
        isInstantBook,
        cancellationPolicy,
    } = body;

    // Liste des champs requis
    const requiredFields = [
        'title', 'description', 'imageSrc', 'category', 'activityType',
        'duration', 'difficulty', 'minParticipants', 'maxParticipants',
        'locationName', 'locationAddress', 'latitude', 'longitude', 'price'
    ];

    // Validation des champs requis
    for (const field of requiredFields) {
        if (body[field] === undefined || body[field] === null) {
            return NextResponse.json({ error: `${field} is required` }, { status: 400 });
        }
    }

    try {
        const listing = await prismadb.listing.create({
            data: {
                title,
                description,
                imageSrc,
                category,
                activityType,
                duration,
                difficulty,
                minParticipants,
                maxParticipants,
                ageRestriction,
                equipment,
                locationName,
                locationAddress,
                latitude,
                longitude,
                price,
                currency: currency || "EUR",
                isInstantBook: isInstantBook || false,
                cancellationPolicy,
                userId: user.id
            }
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json({ error: "Error creating listing" }, { status: 500 });
    }
}
