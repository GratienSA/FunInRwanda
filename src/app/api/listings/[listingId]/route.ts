import prismadb from "@/src/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth"; 

interface IParams {
  listingId?: string;
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const listing = await prismadb.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ listing, user: listing.user }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const user = await currentUser(); 

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const listing = await prismadb.listing.deleteMany({
      where: {
        id: listingId,
        userId: user.id
      }
    });
    
    if (listing.count === 0) {
      return NextResponse.json({ message: 'Listing not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Listing deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const user = await currentUser(); 

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();

    // Ensure imageSrc is an array
    const imageSrc = Array.isArray(body.imageSrc) ? body.imageSrc : [body.imageSrc].filter(Boolean);

    // Convert price to number if it's a string
    const price = typeof body.price === 'string' ? parseFloat(body.price) : body.price;

    if (isNaN(price)) {
      return NextResponse.json({ message: 'Invalid price' }, { status: 400 });
    }

    const updateData = {
      ...body,
      imageSrc,
      price,
      id: undefined,
      userId: undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedListing = await prismadb.listing.update({
      where: {
        id: listingId,
        userId: user.id
      },
      data: updateData
    });

    if (!updatedListing) {
      return NextResponse.json({ message: 'Listing not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Listing updated successfully', listing: updatedListing }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error();
  }
}
