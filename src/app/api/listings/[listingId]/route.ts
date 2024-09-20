import prismadb from "@/src/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth"; 

interface IParams {
  listingId?: string;
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
