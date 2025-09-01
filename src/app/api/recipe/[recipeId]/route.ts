import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const session = await getSession();
        const userId = session?.userId;

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
                        user_id: true,
                        fullname: true,
                        profile_image: true,
                        username: true,
                    }
                },
                instructions: {
                    select: {
                        step_number: true,
                        step_text: true,
                    },
                    orderBy: {
                        step_number: 'asc'
                    }
                },
                recipeIngredients: {
                    select: {
                        ingredient: true,
                        quantity: true,
                        unit: true,
                    }
                },
                bookmarks: userId ? {
                    where: {
                        user_id: userId
                    },
                    select: {
                        user_id: true
                    }
                } : false
            }
        });

        if (!recipe) {
            return NextResponse.json({
                error: "Recipe not found"
            }, { status: 404 });
        }

        const isBookmarked = recipe.bookmarks ? recipe.bookmarks.length > 0 : false;

        const recipeWithBookmarkStatus = {
            ...recipe,
            isBookmarked: isBookmarked,
        };

        return NextResponse.json({
            recipe: recipeWithBookmarkStatus
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/recipe/[recipeId] GET error: ${error}`
        }, { status: 500 });
    }
}

// Action(s) needed:
// 1. For creating a new comment
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get("action");

        switch (action) {
            case "": {

            }
            default: {
                return NextResponse.json({
                    error: "Invalid POST action."
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/api/recipe/[recipeId] POST error: ${error}`
        }, { status: 500 });
    }
}

// Action(s) needed:
// 1. Editing a specific recipe post
// 2. For updating other users' like(s) interaction
// 3. For toggling bookmark status
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get("action");

        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({
                error: "Authentication required"
            }, { status: 401 });
        }

        const userId = session.userId;

        switch (action) {
            case "bookmark": {
                const recipeExists = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) }
                });

                if (!recipeExists) {
                    return NextResponse.json({
                        error: "Recipe not found"
                    }, { status: 404 });
                }

                const existingBookmark = await prisma.bookmark.findUnique({
                    where: {
                        user_id_recipe_id: {
                            user_id: userId,
                            recipe_id: Number(recipeId)
                        }
                    }
                });

                if (existingBookmark) {
                    await prisma.bookmark.delete({
                        where: {
                            bookmark_id: existingBookmark.bookmark_id
                        }
                    });

                    return NextResponse.json({
                        message: "Recipe removed from bookmarks",
                        isBookmarked: false
                    }, { status: 200 });
                } else {
                    await prisma.bookmark.create({
                        data: {
                            user_id: userId,
                            recipe_id: Number(recipeId)
                        }
                    });

                    return NextResponse.json({
                        message: "Recipe bookmarked successfully",
                        isBookmarked: true
                    }, { status: 200 });
                }
            }
            case "like_post": {

            }
            case "comment_post": {

            }
            case "reply_to_comment": {
                
            }
            default: {
                return NextResponse.json({
                    error: "Invalid PUT action."
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/api/recipe/[recipeId] PUT error: ${error}`
        }, { status: 500 });
    }
}

// Actions needed:
// 1. Deleting a specific recipe post
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get("action");

        switch (action) {
            case "delete_post": {

            }
            default: {
                return NextResponse.json({
                    error: "Invalid DELETE recipe action."
                }, { status: 400 })
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/api/recipe/[recipeId] DELETE error: ${error}`
        }, { status: 500 });
    }
}