import prismadb from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      select: { profileImage: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error('Error fetching user image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}