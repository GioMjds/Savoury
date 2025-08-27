import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({
            message: "Feed data fetched successfully"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            error: `/feed GET error: ${error}`
        }, { status: 500 });
    }
};

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const action = searchParams.get("feed_action");

        switch (action) {
            case "post_new_recipe": {
                const body = await req.json();
                const {
                    user_id,
                    title,
                    description,
                    image_url,
                    prep_time_minutes,
                    cook_time_minutes,
                    servings
                } = body;

                if (!user_id || !title) {
                    return NextResponse.json({
                        error: "Missing required fields: user_id and title are required."
                    }, { status: 400 });
                }

                try {
                    const recipe = await prisma.recipe.create({
                        data: {
                            user_id: Number(user_id),
                            title,
                            description,
                            image_url,
                            prep_time_minutes: prep_time_minutes ? Number(prep_time_minutes) : null,
                            cook_time_minutes: cook_time_minutes ? Number(cook_time_minutes) : null,
                            servings: servings ? Number(servings) : null,
                        },
                    });
                    return NextResponse.json({
                        success: true,
                        recipe: {
                            title: recipe.title,
                            description: recipe.description,
                            image_url: recipe.image_url,
                            prep_time_minutes: recipe.prep_time_minutes,
                            cook_time_minutes: recipe.cook_time_minutes,
                            servings: recipe.servings,
                        }
                    }, { status: 201 });
                } catch (error) {
                    return NextResponse.json({
                        error: `/feed POST error: ${error}`
                    }, { status: 500 });
                }
            }
            default: {
                return NextResponse.json({
                    error: "Unknown feed action"
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/feed POST error: ${error}`
        }, { status: 500 });
    }
}