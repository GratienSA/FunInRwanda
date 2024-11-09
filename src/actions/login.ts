"use server";

import * as z from 'zod';
import { AuthError } from 'next-auth';
import prismadb from '../lib/prismadb';
import { LoginSchema } from '../schemas';
import { getUserByEmail } from '../data/user';
import { generateTwoFactorToken, generateVerificationToken } from '../lib/tokens';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '../lib/mail';
import { getTwoFactorTokenByEmail } from '../data/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '../data/two-factor-confirmation';
import { DEFAULT_LOGIN_REDIRECT } from 'routes';
import { signIn } from 'auth';


export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null
) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Champs invalides', issues: validatedFields.error.issues };
    }

    const { email, password, code } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
        return { error: 'Email ou mot de passe incorrect' };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: 'Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.' };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken || twoFactorToken.token !== code) {
                return { error: 'Code invalide' };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: 'Le code a expiré. Veuillez demander un nouveau code.' };
            }

            await prismadb.twoFactorToken.delete({ where: { id: twoFactorToken.id } });
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if (existingConfirmation) {
                await prismadb.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
            }

            await prismadb.twoFactorConfirmation.create({ data: { userId: existingUser.id } });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            return { twoFactor: true, message: 'Un code à deux facteurs a été envoyé à votre adresse email.' };
        }
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        return { success: 'Connexion réussie', redirectUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Email ou mot de passe incorrect' };
                default:
                    return { error: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.' };
            }
        }
        console.error('Erreur inattendue lors de la connexion:', error);
        return { error: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.' };
    }
}