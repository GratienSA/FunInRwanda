import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const category = searchParams.get('category') || undefined;
  const minPrice = Math.max(0, parseFloat(searchParams.get('minPrice') || '0'));
  const maxPrice = Math.max(minPrice, parseFloat(searchParams.get('maxPrice') || '1000000'));

  const skip = (page - 1) * limit;

  try {
    const where: Prisma.ListingWhereInput = {
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { locationName: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
      price: { gte: minPrice, lte: maxPrice },
    };
    const results = await prismadb.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          },
        },
      },
    });

    const total = await prismadb.listing.count({ where });

    return NextResponse.json({ results, total, page, limit });
  } catch (error) {
    console.error('Erreur de recherche:', error);
    return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 });
  }
}