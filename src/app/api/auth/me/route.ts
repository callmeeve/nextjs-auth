import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user.id) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const fetchedUser = await prisma.user.findUnique({
            where: {
                id: user.id
            },
        });

        if (!fetchedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(fetchedUser);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}