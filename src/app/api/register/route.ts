import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; 
import bcrypt from "bcrypt";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword, 
            }
        });

        

        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email }, status: 201 });
    } catch (error) {
        console.error("Error in user registration:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}