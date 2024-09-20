"use server";

import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prismadb from '../lib/prismadb';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            email, 
            name,
            password 
        } = body;

        if (!email || !name || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prismadb.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        const { hashedPassword: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Error in POST /api/register:", error);
        return NextResponse.json({ error: "An error occurred while registering" }, { status: 500 });
    }
}