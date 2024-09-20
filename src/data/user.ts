"use server"

import { User } from "@prisma/client";
import prismadb from "../lib/prismadb";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur par email:", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({
      where: { id }
    });

    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur par ID:", error);
    return null;
  }
};


export const updateUser = async (id: string, data: Partial<User>) => {
  try {
    const updatedUser = await prismadb.user.update({
      where: { id },
      data
    });

    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return null;
  }
};


export const deleteUser = async (id: string) => {
  try {
    await prismadb.user.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return false;
  }
};

export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  try {
    const users = await prismadb.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const totalUsers = await prismadb.user.count();

    return {
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
    return null;
  }
};