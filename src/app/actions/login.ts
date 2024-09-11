"use server";

import { z } from "zod";
import { LoginSchema } from "../schemas";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../../../routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "../data/user";
import { generateVerificationToken } from "../libs/tokens";
import { sendVerificationEmail } from "../libs/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields", issues: validatedFields.error.issues };
    }

    const { email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
        return { error: "Invalid email or password" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );
        return { success: "Confirmation email sent!" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
        return { success: "Logged in successfully!" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
};