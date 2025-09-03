import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get('action');

        const session = await getSession();
        const userId = session?.userId;

        switch (action) {
            case "get_recipe_post": {
                const recipe = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) },
                    include: {
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
                        comments: {
                            include: {
                                user: {
                                    select: {
                                        user_id: true,
                                        fullname: true,
                                        username: true,
                                        profile_image: true,
                                    }
                                }
                            },
                            orderBy: {
                                created_at: "desc"
                            }
                        },
                        userLikes: userId ? {
                            where: { user_id: userId }
                        } : false,
                        bookmarks: userId ? {
                            where: { user_id: userId },
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

                const recipeWithFlags = {
                    ...recipe,
                    isLiked: userId ? recipe.userLikes.length > 0 : false,
                    isBookmarked: userId ? recipe.bookmarks.length > 0 : false
                };

                return NextResponse.json({
                    success: true,
                    data: recipeWithFlags
                }, { status: 200 });
            }
            default: {
                return NextResponse.json({
                    error: "Invalid GET action"
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/api/recipe/[recipeId] GET error: ${error}`
        }, { status: 500 });
    }
}

// Action(s) needed:
// 1. For creating a new comment
// 2. Liking a specific post
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get("action");
        const session = await getSession();

        if (!session) {
            return NextResponse.json({
                error: "Unauthorized - No session found"
            }, { status: 401 });
        }

        const userId = session.userId;

        switch (action) {
            case "like_post": {
                const recipe = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) },
                    select: {
                        recipe_id: true,
                        user: true,
                        likes: true,
                    }
                });

                if (!recipe) {
                    return NextResponse.json({
                        error: "Recipe not found"
                    }, { status: 404 });
                }

                const existingLike = await prisma.userLike.findUnique({
                    where: {
                        user_id_recipe_id: {
                            user_id: userId,
                            recipe_id: Number(recipeId)
                        }
                    }
                });

                if (existingLike) {
                    return NextResponse.json({
                        error: "You have already liked this post."
                    }, { status: 409 })
                }

                await prisma.$transaction(async (tx) => {
                    await tx.userLike.create({
                        data: {
                            user_id: userId,
                            recipe_id: Number(recipeId)
                        }
                    });

                    await tx.recipe.update({
                        where: { recipe_id: Number(recipeId) },
                        data: {
                            likes: { increment: 1 }
                        }
                    });
                });

                const updatedRecipe = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) },
                    select: { likes: true }
                });

                return NextResponse.json({
                    success: true,
                    message: "Recipe liked successfully",
                    data: {
                        isLiked: true,
                        likesCount: updatedRecipe?.likes || 0,
                        recipeId: Number(recipeId)
                    }
                }, { status: 200 });
            }
            case "new_comment": {
                
            }
            case "reply_to_comment": {

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
                error: "Unauthorized - No session found"
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
            case "edit_recipe_post": {
                
            }
            case "edit_comment": {

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
// 1. Deleting a recipe post
// 2. Unliking a recipe post
// 3. Deleting a comment
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    const { recipeId } = await params;
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get("action");
        const session = await getSession();

        if (!session) {
            return NextResponse.json({
                error: "Unauthorized - No session found"
            }, { status: 401 });
        }

        const userId = session.userId;

        switch (action) {
            case "delete_post": {
                
            }
            case "unlike_post": {
                const recipe = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) },
                    select: {
                        recipe_id: true,
                        user_id: true,
                        likes: true
                    }
                });

                if (!recipe) {
                    return NextResponse.json({
                        error: "Recipe not found"
                    }, { status: 404 });
                }

                const existingLike = await prisma.userLike.findUnique({
                    where: {
                        user_id_recipe_id: {
                            user_id: userId,
                            recipe_id: Number(recipeId)
                        }
                    }
                });

                if (!existingLike) {
                    return NextResponse.json({
                        error: "You haven't liked this recipe yet"
                    }, { status: 409 });
                }

                // Remove the like and update recipe likes count
                await prisma.$transaction(async (tx) => {
                    await tx.userLike.delete({
                        where: {
                            user_id_recipe_id: {
                                user_id: userId,
                                recipe_id: Number(recipeId)
                            }
                        }
                    });

                    await tx.recipe.update({
                        where: { recipe_id: Number(recipeId) },
                        data: {
                            likes: {
                                decrement: 1
                            }
                        }
                    });
                });

                const updatedRecipe = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) },
                    select: { likes: true }
                });

                return NextResponse.json({
                    success: true,
                    message: "Recipe unliked successfully",
                    data: {
                        isLiked: false,
                        likesCount: updatedRecipe?.likes || 0,
                        recipeId: Number(recipeId)
                    }
                }, { status: 200 });
            }
            case "delete_comment": {

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