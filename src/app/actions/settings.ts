"use server";

import { z } from "zod"
import { SettingsSchema } from "../schemas";
import { getUserById } from "../libs/user";
import { currentUser } from "../libs/auth";
import prismadb from "../libs/prismadb";

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    // Vérifier l'utilisateur actuel
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    // Récupérer l'utilisateur de la base de données
    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    await prismadb.user.update({
        where: { id: dbUser.id },
        data:{
           ...values 
        } 
    });

    return { success: "Settings upadated"}
}