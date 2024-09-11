import { getVerificationTokenByToken } from "../data/verification-token";
import { getUserByEmail } from "../data/user";
import prismadb from "../libs/prismadb";

export const NewVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token not found" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Email not found" };
    }

    try {
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

        return { success: "Email verified" };
    } catch (error) {
        console.error("Error during verification:", error);
        return { error: "An error occurred during verification" };
    }
};