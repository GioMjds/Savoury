import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    try {
        const searchParams = req.nextUrl.searchParams;
    } catch (error) {
        return NextResponse.json({
            error: `/saved/[userId] GET error: ${error}`
        }, { status: 500 });
    }
}