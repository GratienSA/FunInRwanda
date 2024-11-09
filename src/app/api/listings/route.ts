import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { Prisma } from "@prisma/client";


export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const listings = await prismadb.listing.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Error fetching listings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Received imageSrc:", body.imageSrc);
    console.log("Received data:", JSON.stringify(body, null, 2));

    // Champs obligatoires à valider
    const requiredFields = [
      "title",
      "description",
      "imageSrc",
      "category",
      "activityType",
      "duration",
      "difficulty",
      "minParticipants",
      "maxParticipants",
      "locationName",
      "locationAddress",
      "latitude",
      "longitude",
      "price"
    ];

    // Vérification de la présence des champs obligatoires
    for (const field of requiredFields) {
      if (field === "imageSrc") {
        console.log("Checking imageSrc:", body[field]);
        if (!Array.isArray(body[field]) || body[field].length === 0) {
          console.log("imageSrc validation failed");
          return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
        }
      } else if (!body[field]) {
        console.log(`${field} is missing or empty`);
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Vérification des champs numériques
    const numericFields = [
      "duration",
      "minParticipants",
      "maxParticipants",
      "latitude",
      "longitude",
      "price"
    ];
    for (const field of numericFields) {
      body[field] = Number(body[field]);
      if (isNaN(body[field])) {
        console.log(`Validation failed: ${field} is not a valid number`);
        return NextResponse.json({ error: `${field} must be a number` }, { status: 400 });
      }
    }

    // Préparation des données avant l'envoi à la base de données
    const listingData = {
      title: body.title,
      description: body.description,
      imageSrc: body.imageSrc, // Array d'URL d'images
      category: body.category,
      activityType: body.activityType,
      duration: body.duration,
      difficulty: body.difficulty,
      minParticipants: body.minParticipants,
      maxParticipants: body.maxParticipants,
      ageRestriction: body.ageRestriction ? Number(body.ageRestriction) : null,
      equipment: Array.isArray(body.equipment) ? body.equipment : body.equipment ? [body.equipment] : [],
      locationName: typeof body.locationName === "object" ? body.locationName.value : body.locationName,
      locationAddress: body.locationAddress,
      latitude: body.latitude,
      longitude: body.longitude,
      price: body.price,
      currency: body.currency || "EUR",
      isInstantBook: Boolean(body.isInstantBook),
      cancellationPolicy: body.cancellationPolicy || "",
      userId: user.id, // ID de l'utilisateur connecté
    };

    // Création de l'annonce dans la base de données
    console.log("Attempting to create listing with data:", JSON.stringify(listingData, null, 2));
    const listing = await prismadb.listing.create({
      data: listingData,
    });

    console.log("Listing created successfully:", JSON.stringify(listing, null, 2));
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.log("Prisma validation error:", error.message);
      return NextResponse.json({ error: "Validation error", details: error.message }, { status: 400 });
    }
    if (error instanceof Error) {
      console.log("Unexpected error:", error.message);
      return NextResponse.json({ error: "Error creating listing", details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
