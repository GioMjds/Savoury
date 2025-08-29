import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { recipe_id: Number(recipeId) },
            include: {
                comments: {
                    select: {
                        comment_text: true,
                        created_at: true,
                        user: true,
                    }
                },
                ratings: {
                    select: {
                        rating: true,
                        created_at: true,
                    }
                },
                user: {
                    select: {
                        fullname: true,
                        profile_image: true,
                        username: true,
                    }
                },
                instructions: {
                    select: {
                        step_number: true,
                        step_text: true,
                    }
                },
                recipeIngredients: {
                    select: {
                        ingredient: true,
                        quantity: true,
                        unit: true,
                    }
                }
            }
        });

        if (!recipe) {
            return NextResponse.json({
                error: "Recipe not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            recipe: recipe
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/recipe/[recipeId] GET error: ${error}`
        }, { status: 500 });
    }
}

// Editing a specific recipe post
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        
    } catch (error) {
        
    }
}