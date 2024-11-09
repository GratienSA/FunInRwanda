import { updateUserRole } from '@/src/actions/settings';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, newRole } = req.body;

    try {
      const updatedUser = await updateUserRole(userId, newRole);
      return res.status(200).json(updatedUser);
    } catch (error) {
      // Vérifier si l'erreur est bien une instance de Error
      if (error instanceof Error) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle', details: error.message });
      }
      // Si ce n'est pas une instance d'Error, renvoyer un message générique
      return res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour du rôle' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
