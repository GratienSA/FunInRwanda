import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
      return NextResponse.json({ message: "Authorized" }, { status: 200 });
    }

    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
