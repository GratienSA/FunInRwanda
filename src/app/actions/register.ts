"use server";

import { z } from "zod";
import { RegisterSchema } from "../schemas";
import { hash } from "bcryptjs";
import prismadb from "../libs/prismadb";
import { getUserByEmail } from "../data/user";
import { generateVerificationToken } from "../libs/tokens";
import { sendVerificationEmail } from "../libs/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Champs invalides", issues: validatedFields.error.issues };
    }

    const { email, password, name, image } = validatedFields.data;

   
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Cette adresse e-mail est déjà utilisée" };
    }

  
    const hashedPassword = await hash(password, 10);

    try {
        const user = await prismadb.user.create({
            data: {
                email: email.toLowerCase(),
                hashedPassword,
                name,
                image,
                role: "USER", 
            }
        });

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);


        return { 
            success: true, 
            message: "Utilisateur enregistré avec succès",
            userId: user.id 
        };
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
        return { error: "Une erreur s'est produite lors de l'enregistrement" };
    }
};