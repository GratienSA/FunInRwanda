import { v4 as uuidv4 } from 'uuid';
import { getVerificationTokenByEmail } from "../data/verification-token";
import prismadb from "./prismadb";
import { getPasswordResetTokenByEmail } from '../data/password-reset-token';

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600000); // Expire dans 1 heure

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        // Si un token existe déjà pour cet email, on le supprime
        await prismadb.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    // Création d'un nouveau token de réinitialisation de mot de passe
    const passwordResetToken = await prismadb.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return passwordResetToken;
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4(); // Génère un token unique
    const expires = new Date(new Date().getTime() + 3600000); // Expire dans 1 heure

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        // Si un token existe déjà pour cet email, on le supprime
        await prismadb.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    // Création d'un nouveau token de vérification
    const verificationToken = await prismadb.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken;
}