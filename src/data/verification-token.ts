import { v4 as uuidv4 } from 'uuid';
import prismadb from '../lib/prismadb';

export const createVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000);

    await prismadb.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return token;
}

export const getVerificationTokenByToken = async (token: string) => {
    console.log("Searching for token:", token);
    try {
        const verificationToken = await prismadb.verificationToken.findUnique({
            where: { token }
        });
        
        if (verificationToken) {
            console.log("Token found:", verificationToken);
        } else {
            console.log("Token not found in database");
        }
        
        return verificationToken;
    } catch (error) {
        console.error("Error fetching verification token by token:", error);
        return null;
    }
}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prismadb.verificationToken.findUnique({
            where: { email }
        });
        return verificationToken;
    } catch (error) {
        console.error("Error fetching verification token by email:", error);
        return null;
    }
}