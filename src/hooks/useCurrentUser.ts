import { useSession } from "next-auth/react";
import { SafeUser, ExtendedUser } from "../types";
import { UserRole } from "@prisma/client";

// Définition de l'interface pour le résultat du hook
interface CurrentUserHookResult {
  user: SafeUser | null;  // L'utilisateur actuel ou null s'il n'est pas connecté
  isLoading: boolean;     // Indique si les données de session sont en cours de chargement
}

// Définition du hook useCurrentUser
export const useCurrentUser = (): CurrentUserHookResult => {
  // Utilisation du hook useSession de NextAuth
  const { data: session, status } = useSession();

  // Si le statut est "loading", on retourne un état de chargement
  if (status === "loading") {
    return { user: null, isLoading: true };
  }

  // Si aucune session utilisateur n'existe, on retourne null pour l'utilisateur
  if (!session?.user) {
    return { user: null, isLoading: false };
  }

  // Cast de l'utilisateur de session en ExtendedUser
  const user = session.user as ExtendedUser;

  // Création d'un objet SafeUser à partir des données de l'utilisateur
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    profileImage: user.profileImage || '',
    // Conversion de la date de vérification d'email en ISO string ou null
    emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
    // Utilisation de (user as any) pour accéder à des propriétés potentiellement non définies
    hashedPassword: (user as any).hashedPassword || null,
    favoriteIds: (user as any).favoriteIds || [],
    role: (user as any).role || UserRole.USER,
    isTwoFactorEnabled: (user as any).isTwoFactorEnabled || false,
    isOAuth: (user as any).isOAuth || false,
    // Conversion des dates en ISO string, utilisation de la date actuelle si non définie
    createdAt: (user as any).createdAt ? new Date((user as any).createdAt).toISOString() : new Date().toISOString(),
    updatedAt: (user as any).updatedAt ? new Date((user as any).updatedAt).toISOString() : new Date().toISOString(),
  };

  // Retour de l'utilisateur sécurisé et de l'état de chargement
  return { user: safeUser, isLoading: false };
}


// Ce hook utilise useSession de NextAuth pour obtenir les informations de session de l'utilisateur.
// Il gère trois cas principaux :
// Chargement en cours
// Aucun utilisateur connecté
// Utilisateur connecté
// Pour l'utilisateur connecté, il crée un objet SafeUser à partir des données de session.
//  Cela permet de contrôler exactement quelles informations de l'utilisateur sont exposées et utilisées dans l'application.
// Il utilise des valeurs par défaut pour plusieurs propriétés, ce qui rend le hook plus robuste face aux données manquantes.
// Les dates sont converties en chaînes ISO pour une meilleure compatibilité et cohérence.
// Le hook retourne toujours un objet avec user et isLoading, ce qui permet une utilisation cohérente dans les composants.
// Ce hook est très utile pour gérer l'état de l'utilisateur actuel dans toute l'application, en fournissant un accès facile et sécurisé aux informations de l'utilisateur connecté.
