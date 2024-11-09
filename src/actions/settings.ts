"use server"; // Indique que ce code sera exécuté sur le serveur, pas dans le navigateur.

import * as z from "zod"; // Importation de la bibliothèque Zod pour la validation des données.
import bcrypt from "bcrypt"; // Importation de bcrypt pour le hachage des mots de passe.
import { auth } from "@/auth"; // Importation de la fonction d'authentification.
import { SettingsSchema } from "../schemas"; // Importation d'un schéma de validation pour les paramètres.
import { getUserByEmail, getUserById } from "../data/user"; // Importation de fonctions pour récupérer des utilisateurs.
import { generateVerificationToken } from "../lib/tokens"; // Importation d'une fonction pour générer un token de vérification.
import { sendVerificationEmail } from "../lib/mail"; // Importation d'une fonction pour envoyer des emails.
import prismadb from "../lib/prismadb"; // Importation de l'instance Prisma pour interagir avec la base de données.
import { SafeUser, UserRole } from "../types";

export const settings = async ( // Déclaration d'une fonction asynchrone appelée settings.
  values: z.infer<typeof SettingsSchema> // La fonction prend des valeurs qui respectent le schéma SettingsSchema.
) => {
  const session = await auth(); // Vérifie si l'utilisateur est authentifié et récupère la session.

  // Vérifie si l'utilisateur n'est pas authentifié
  if (!session?.user?.id) { // Si l'utilisateur n'a pas d'ID dans la session,
    return { error: "Unauthorized" }; // retourne une erreur d'accès non autorisé.
  }

  const user = await getUserById(session.user.id); // Récupère les informations de l'utilisateur actuel.

  // Vérifie si l'utilisateur existe
  if (!user) { // Si l'utilisateur n'existe pas,
    return { error: "Unauthorized" }; // retourne une erreur d'accès non autorisé.
  }

  // Si l'utilisateur se connecte avec un service OAuth (comme Google ou Facebook),
  if (session.user.isOAuth) {
    // Alors on ne permet pas de modifier l'email ou le mot de passe
    values.email = undefined; // Met à undefined (inaccessible) l'email
    values.password = undefined; // Met à undefined le mot de passe actuel
    values.newPassword = undefined; // Met à undefined le nouveau mot de passe
    values.isTwoFactorEnabled = undefined; // Met à undefined la vérification en deux étapes
  }

  // Si l'utilisateur essaie de changer son email
  if (values.email && values.email !== user.email) { 
    const existingUser = await getUserByEmail(values.email); // Vérifie si l'email existe déjà.

    // Vérifie si un autre utilisateur a déjà cet email
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" }; // Retourne une erreur si l'email est déjà utilisé par un autre.
    }

    // Si l'email est nouveau, génère un token de vérification
    const verificationToken = await generateVerificationToken(
      values.email
    );
    
    // Envoie un email de vérification à l'utilisateur
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" }; // Confirme que l'email de vérification a été envoyé.
  }

  // Si l'utilisateur essaie de changer son mot de passe
  if (values.password && values.newPassword && user.hashedPassword) {
    // Vérifie si le mot de passe actuel est correct
    const passwordsMatch = await bcrypt.compare(
      values.password,
      user.hashedPassword,
    );
  
    // Si le mot de passe est incorrect
    if (!passwordsMatch) {
      return { error: "Incorrect password!" }; // Retourne une erreur si le mot de passe est incorrect.
    }
  
    // Hache le nouveau mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10, // Le nombre de tours pour le hachage
    );
    values.password = hashedPassword; // Met à jour le mot de passe avec le nouveau haché
    values.newPassword = undefined; // Réinitialise le nouveau mot de passe pour éviter les enregistrements redondants.
  }

  // Met à jour les informations de l'utilisateur dans la base de données
  await prismadb.user.update({
    where: { id: user.id }, // Indique quel utilisateur mettre à jour
    data: {
      ...values, // Utilise les nouvelles valeurs fournies pour la mise à jour
    }
  });
  
  return { success: "Settings Updated!" }; // Retourne une confirmation que les paramètres ont été mis à jour.
}

// Définir un type UserData qui ne contient pas les propriétés non désirées
export type UserData = {
  id: string; // ID de l'utilisateur
  name?: string | null; // Nom de l'utilisateur (optionnel)
  email?: string | null; // Email de l'utilisateur (optionnel)
  newPassword?: string; // Nouveau mot de passe (optionnel)
  isTwoFactorEnabled?: boolean; // Vérification en deux étapes (optionnel)
};

// Fonction pour mettre à jour l'utilisateur
export const updateUser = async (userData: UserData) => {
  try {
    const dataToUpdate = {
      ...(userData.name && { name: userData.name }), // Mise à jour du nom
      ...(userData.email && { email: userData.email }), // Mise à jour de l'email
      ...(userData.newPassword && { hashedPassword: await bcrypt.hash(userData.newPassword, 10) }), // Hachage du nouveau mot de passe
      ...(userData.isTwoFactorEnabled !== undefined && { isTwoFactorEnabled: userData.isTwoFactorEnabled }), // Mise à jour de la vérification à deux facteurs
    };

    // Mise à jour de l'utilisateur dans la base de données
    const updatedUser = await prismadb.user.update({
      where: { id: userData.id }, // ID de l'utilisateur à mettre à jour
      data: dataToUpdate, // Les données à mettre à jour
    });

    return { success: true, user: updatedUser }; // Retourne l'utilisateur mis à jour
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’utilisateur:', error); // Gestion des erreurs
    return { error: 'Erreur lors de la mise à jour.' }; // Retourne une erreur
  }
};



// Fonction pour mettre à jour le rôle d'un utilisateur
export const updateUserRole = async (userId: string, newRole: UserRole) => { 
  const validRoles = ['USER', 'ADMIN'] as const; // Utiliser 'as const' pour définir des rôles valides
  if (!validRoles.includes(newRole)) {
    throw new Error("Rôle invalide");
  }

  try {
    const existingUser = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("Utilisateur non trouvé");
    }

    const updatedUser = await prismadb.user.update({
      where: { id: userId },
      data: { role: newRole as UserRole },
    });

    console.log('Utilisateur mis à jour:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle de l'utilisateur:", error);
    throw error;
  }
};

