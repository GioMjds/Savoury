import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    try {
        const savedItems = await prisma.bookmark.findMany({
            where: { user_id: Number(userId) },
            include: {
                recipe: true,
                user: true
            }
        });

        return NextResponse.json({
            bookmark: savedItems
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/saved/[userId] GET error: ${error}`
        }, { status: 500 });
    }
}