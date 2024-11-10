import { updateUserRole } from '@/actions/settings';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, newRole } = await req.json();

  try {
    const updatedUser = await updateUserRole(userId, newRole);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du rôle', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur inconnue lors de la mise à jour du rôle' },
      { status: 500 }
    );
  }
}