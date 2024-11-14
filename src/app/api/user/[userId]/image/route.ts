import prismadb from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

// Fonction pour générer les paramètres statiques
export async function generateStaticParams() {
    // Remplacez ceci par votre logique pour obtenir les userIds
    const userIds = await fetchUserIds(); // Une fonction qui récupère les IDs des utilisateurs
    
    return userIds.map(userId => ({
        userId: String(userId) // Assurez-vous que l'ID est une chaîne
    }));
}

// Fonction GET pour récupérer l'image de profil d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  // Validation du userId
  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      select: { profileImage: true }
    });

    // Vérification si l'utilisateur existe
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Retourner l'image de profil
    return NextResponse.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error('Error fetching user image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Exemple de fonction fetchUserIds (à adapter selon vos besoins)
async function fetchUserIds() {
    // Logique pour récupérer les IDs des utilisateurs, par exemple depuis une API ou une base de données
    // Pour cet exemple, nous retournons des IDs statiques
    return [1, 2, 3]; // Remplacez cela par votre logique réelle
}