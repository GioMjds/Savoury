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
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                username: true,
                                fullname: true,
                                profile_image: true,
                            }
                        }
                    }
                });

                if (!recipe) {
                    return NextResponse.json({
                        error: "Recipe not found"
                    }, { status: 404 });
                }

                // Don't allow users to like their own recipes
                if (recipe.user_id === userId) {
                    return NextResponse.json({
                        error: "You cannot like your own recipe"
                    }, { status: 400 });
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

                // Get current user info for notification
                const currentUser = await prisma.users.findUnique({
                    where: { user_id: userId },
                    select: {
                        user_id: true,
                        username: true,
                        fullname: true,
                        profile_image: true,
                    }
                });

                if (!currentUser) {
                    return NextResponse.json({
                        error: "User not found"
                    }, { status: 404 });
                }

                // Create like and notification in transaction
                const result = await prisma.$transaction(async (tx) => {
                    // Create the like
                    await tx.userLike.create({
                        data: {
                            user_id: userId,
                            recipe_id: Number(recipeId)
                        }
                    });

                    // Update recipe likes count
                    const updatedRecipe = await tx.recipe.update({
                        where: { recipe_id: Number(recipeId) },
                        data: {
                            likes: { increment: 1 }
                        }
                    });

                    // Create notification for recipe owner (only if it's not the same user)
                    const notification = await tx.notification.create({
                        data: {
                            recipient_id: recipe.user_id,
                            sender_id: userId,
                            recipe_id: Number(recipeId),
                            type: 'like',
                            message: `${currentUser.fullname} liked your recipe "${recipe.title}"`
                        },
                        include: {
                            sender: {
                                select: {
                                    user_id: true,
                                    username: true,
                                    fullname: true,
                                    profile_image: true,
                                }
                            },
                            recipe: {
                                select: {
                                    recipe_id: true,
                                    title: true,
                                    image_url: true,
                                }
                            }
                        }
                    });

                    return {
                        likes: updatedRecipe.likes,
                        notification
                    };
                });

                return NextResponse.json({
                    success: true,
                    message: "Recipe liked successfully",
                    data: {
                        isLiked: true,
                        likesCount: result.likes,
                        recipeId: Number(recipeId),
                        notification: {
                            id: result.notification.notification_id,
                            type: result.notification.type,
                            message: result.notification.message,
                            sender: result.notification.sender,
                            recipe: result.notification.recipe,
                            created_at: result.notification.created_at
                        }
                    }
                }, { status: 200 });
            }
            case "new_comment": {
                const { comment } = await req.json();

                if (!comment) {
                    return NextResponse.json({
                        error: 'Comment text is required.'
                    }, { status: 400 });
                }

                const recipe = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) },
                    select: {
                        recipe_id: true,
                        user_id: true,
                        title: true,
                        image_url: true,
                    }
                });

                if (!recipe) {
                    return NextResponse.json({
                        error: "Recipe not found."
                    }, { status: 404 });
                }

                const currentUser = await prisma.users.findUnique({
                    where: { user_id: Number(userId) },
                    select: {
                        user_id: true,
                        username: true,
                        fullname: true,
                        profile_image: true,
                    }
                });

                if (!currentUser) {
                    return NextResponse.json({
                        error: "User not found."
                    }, { status: 404 });
                }

                const result = await prisma.$transaction(async (tx) => {
                    const newComment = await tx.comment.create({
                        data: {
                            user_id: userId,
                            recipe_id: Number(recipeId),
                            comment_text: comment
                        },
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    username: true,
                                    fullname: true,
                                    profile_image: true,
                                }
                            }
                        }
                    });

                    let notification = null;
                    if (recipe.user_id !== userId) {
                        notification = await tx.notification.create({
                            data: {
                                recipient_id: recipe.user_id,
                                sender_id: userId,
                                recipe_id: Number(recipeId),
                                type: 'comment',
                                message: `${currentUser.fullname} commented on your recipe "${recipe.title}"`
                            },
                            include: {
                                sender: {
                                    select: {
                                        user_id: true,
                                        username: true,
                                        fullname: true,
                                        profile_image: true,
                                    }
                                },
                                recipe: {
                                    select: {
                                        recipe_id: true,
                                        title: true,
                                        image_url: true,
                                    }
                                }
                            }
                        });
                    }

                    return {
                        comment: newComment,
                        notification
                    };
                });

                return NextResponse.json({
                    success: true,
                    message: "Comment posted successfully",
                    data: {
                        comment: {
                            comment_id: result.comment.comment_id,
                            comment_text: result.comment.comment_text,
                            created_at: result.comment.created_at,
                            user: result.comment.user,
                            recipe_id: Number(recipeId)
                        },
                        notification: result.notification ? {
                            id: result.notification.notification_id,
                            type: result.notification.type,
                            message: result.notification.message,
                            sender: result.notification.sender,
                            recipe: result.notification.recipe,
                            created_at: result.notification.created_at
                        } : null
                    }
                }, { status: 201 });
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

                // Remove like and related notification in transaction
                const result = await prisma.$transaction(async (tx) => {
                    // Remove the like
                    await tx.userLike.delete({
                        where: {
                            user_id_recipe_id: {
                                user_id: userId,
                                recipe_id: Number(recipeId)
                            }
                        }
                    });

                    // Update recipe likes count
                    const updatedRecipe = await tx.recipe.update({
                        where: { recipe_id: Number(recipeId) },
                        data: {
                            likes: { decrement: 1 }
                        }
                    });

                    // Remove the like notification
                    const deletedNotifications = await tx.notification.deleteMany({
                        where: {
                            sender_id: userId,
                            recipe_id: Number(recipeId),
                            type: 'like'
                        }
                    });

                    return {
                        likes: updatedRecipe.likes,
                        deletedCount: deletedNotifications.count
                    };
                });

                return NextResponse.json({
                    success: true,
                    message: "Recipe unliked successfully",
                    data: {
                        isLiked: false,
                        likesCount: result.likes,
                        recipeId: Number(recipeId),
                        removedNotifications: result.deletedCount
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