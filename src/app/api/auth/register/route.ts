import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}