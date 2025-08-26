import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: Number(userId) },
            include: {
                comments: true,
                ratings: true,
                recipes: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: `User ${user.fullname} retrieved successfully`,
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                fullname: user.fullname,
                profile_image: user.profile_image,
                created_at: user.created_at.toISOString(),
                comments: user.comments,
                ratings: user.ratings,
                recipes: user.recipes,
            },
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            error: `/api/profile/[userId] GET error: ${error}` 
        }, { status: 500 });
    }
}