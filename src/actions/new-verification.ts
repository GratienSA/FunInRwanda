"use server"

import { getVerificationTokenByToken } from "../data/verification-token";
import { getUserByEmail } from "../data/user";
import prismadb from "../lib/prismadb";

export const newVerification = async (token: string) => {
    console.log("newVerification called with token:", token);

    if (!token) {
        console.log("No token provided");
        return { error: "Missing token" };
    }

    try {
        const existingToken = await getVerificationTokenByToken(token);

        if (!existingToken) {
            console.log("Token not found in database");
            return { error: "Invalid or expired token" };
        }

        console.log("Token found:", existingToken);

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            console.log("Token has expired");
            await prismadb.verificationToken.delete({
                where: { id: existingToken.id }
            });
            return { error: "Token has expired" };
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            console.log("User not found for email:", existingToken.email);
            return { error: "Email not found" };
        }

        console.log("User found:", existingUser);

        if (existingUser.emailVerified) {
            console.log("Email already verified for user:", existingUser.email);
            await prismadb.verificationToken.delete({
                where: { id: existingToken.id }
            });
            return { info: "Email already verified" };
        }

        await prismadb.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
                email: existingToken.email,
            },
        });

        await prismadb.verificationToken.delete({
            where: { id: existingToken.id }
        });

        console.log("Email verified successfully");
        return { success: "Email verified successfully" };
    } catch (error) {
        console.error("Error during verification:", error);
        return { error: "An error occurred during verification" };
    }
};