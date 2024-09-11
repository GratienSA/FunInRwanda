import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(
    request: Request,
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
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

    
    const requiredFields = [
        'title', 'description', 'imageSrc', 'category', 'activityType',
        'duration', 'difficulty', 'minParticipants', 'maxParticipants',
        'locationName', 'locationAddress', 'latitude', 'longitude', 'price'
    ];

    for (const field of requiredFields) {
        if (!body[field]) {
            return NextResponse.json({ error: `${field} is required` }, { status: 400 });
        }
    }

    try {
        const listing = await prisma.listing.create({
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
                userId: currentUser.id
            }
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json({ error: "Error creating listing" }, { status: 500 });
    }
}