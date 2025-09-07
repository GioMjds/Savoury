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
                            where: {
                                parent_comment_id: null
                            },
                            include: {
                                user: {
                                    select: {
                                        user_id: true,
                                        fullname: true,
                                        username: true,
                                        profile_image: true,
                                    }
                                },
                                likes: userId ? {
                                    where: { user_id: userId },
                                    select: {
                                        user_id: true,
                                        comment_like_id: true
                                    }
                                } : false,
                                replies: {
                                    include: {
                                        user: {
                                            select: {
                                                user_id: true,
                                                fullname: true,
                                                username: true,
                                                profile_image: true,
                                            }
                                        },
                                        likes: userId ? {
                                            where: { user_id: userId },
                                            select: {
                                                user_id: true,
                                                comment_like_id: true
                                            }
                                        } : false,
                                        _count: {
                                            select: {
                                                likes: true
                                            }
                                        }
                                    },
                                    orderBy: {
                                        created_at: 'asc'
                                    }
                                },
                                _count: {
                                    select: {
                                        likes: true,
                                        replies: true
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
                        } : false,
                        _count: {
                            select: {
                                userLikes: true,
                                comments: true,
                            }
                        }
                    }
                });

                if (!recipe) {
                    return NextResponse.json({
                        error: "Recipe not found"
                    }, { status: 404 });
                }

                const recipeWithFlags = {
                    ...recipe,
                    likes: recipe._count.userLikes,
                    isLiked: userId ? recipe.userLikes.length > 0 : false,
                    isBookmarked: userId ? recipe.bookmarks.length > 0 : false
                };

                return NextResponse.json({
                    success: true,
                    recipe: recipeWithFlags
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
                const { comment, parentCommentId } = await req.json();

                if (!comment) {
                    return NextResponse.json({
                        error: 'Comment text is required.'
                    }, { status: 400 });
                }

                if (!parentCommentId) {
                    return NextResponse.json({
                        error: 'Parent comment ID is required for replies.'
                    }, { status: 400 });
                }

                const parentComment = await prisma.comment.findUnique({
                    where: { comment_id: Number(parentCommentId) },
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                fullname: true
                            }
                        }
                    }
                });

                if (!parentComment) {
                    return NextResponse.json({
                        error: "Parent comment not found."
                    }, { status: 404 });
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
                    const newReply = await tx.comment.create({
                        data: {
                            user_id: userId,
                            recipe_id: Number(recipeId),
                            parent_comment_id: Number(parentCommentId),
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
                    if (parentComment.user_id !== userId) {
                        notification = await tx.notification.create({
                            data: {
                                recipient_id: parentComment.user_id,
                                sender_id: userId,
                                recipe_id: Number(recipeId),
                                type: 'comment',
                                message: `${currentUser.fullname} replied to your comment on "${recipe.title}"`
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
                        reply: newReply,
                        notification
                    };
                });

                return NextResponse.json({
                    success: true,
                    message: "Reply posted successfully",
                    data: {
                        comment: {
                            comment_id: result.reply.comment_id,
                            comment_text: result.reply.comment_text,
                            created_at: result.reply.created_at,
                            parent_comment_id: result.reply.parent_comment_id,
                            user: result.reply.user,
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
                const { title,
                    description,
                    image_url,
                    prep_time_minutes,
                    cook_time_minutes,
                    servings,
                    category,
                    ingredients,
                    instructions
                } = await req.json();

                const recipeExists = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) }
                });

                if (!recipeExists) {
                    return NextResponse.json({
                        error: "Recipe not found. You can't edit a non-existent recipe."
                    }, { status: 404 })
                }

                if (recipeExists.user_id !== userId) {
                    return NextResponse.json({
                        error: "You can only edit your own recipes."
                    }, { status: 403 });
                }

                const updatedRecipe = await prisma.recipe.update({
                    where: { recipe_id: Number(recipeId) },
                    data: {
                        title,
                        description,
                        image_url,
                        prep_time_minutes,
                        cook_time_minutes,
                        servings,
                        category,
                    }
                });

                await prisma.recipeIngredient.deleteMany({
                    where: { recipe_id: Number(recipeId) }
                });

                await prisma.instruction.deleteMany({
                    where: { recipe_id: Number(recipeId) }
                });

                if (Array.isArray(ingredients) && ingredients.length > 0) {
                    for (const ing of ingredients) {
                        // Find or create ingredient
                        let ingredientRecord = await prisma.ingredient.findUnique({
                            where: { ingredient_name: ing.ingredient_name.trim() }
                        });
                        if (!ingredientRecord) {
                            ingredientRecord = await prisma.ingredient.create({
                                data: { ingredient_name: ing.ingredient_name.trim() }
                            });
                        }
                        await prisma.recipeIngredient.create({
                            data: {
                                recipe_id: Number(recipeId),
                                ingredient_id: ingredientRecord.ingredient_id,
                                quantity: ing.quantity ? Number(ing.quantity) : null,
                                unit: ing.unit || null
                            }
                        });
                    }
                }

                if (Array.isArray(instructions) && instructions.length > 0) {
                    for (let i = 0; i < instructions.length; i++) {
                        const step = instructions[i];
                        await prisma.instruction.create({
                            data: {
                                recipe_id: Number(recipeId),
                                step_number: i + 1,
                                step_text: step.value
                            }
                        });
                    }
                }

                return NextResponse.json({
                    message: "Recipe updated successfully",
                    recipe: updatedRecipe
                }, { status: 200 });
            }
            case "like_comment": {
                const commentId = searchParams.get("commentId");
                
                if (!commentId) {
                    return NextResponse.json({
                        error: "Comment ID is required"
                    }, { status: 400 });
                }

                const comment = await prisma.comment.findUnique({
                    where: { comment_id: Number(commentId) },
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                fullname: true
                            }
                        }
                    }
                });

                if (!comment) {
                    return NextResponse.json({
                        error: "Comment not found"
                    }, { status: 404 });
                }

                const existingLike = await prisma.commentLike.findUnique({
                    where: {
                        user_id_comment_id: {
                            user_id: userId,
                            comment_id: Number(commentId)
                        }
                    }
                });

                if (existingLike) {
                    await prisma.$transaction(async (tx) => {
                        await tx.commentLike.delete({
                            where: {
                                comment_like_id: existingLike.comment_like_id
                            }
                        });

                        await tx.comment.update({
                            where: { comment_id: Number(commentId) },
                            data: {
                                comment_likes: { decrement: 1 }
                            }
                        });
                    });

                    return NextResponse.json({
                        success: true,
                        message: "Comment unliked successfully",
                        data: {
                            isLiked: false,
                            commentId: Number(commentId)
                        }
                    }, { status: 200 });
                } else {
                    await prisma.$transaction(async (tx) => {
                        await tx.commentLike.create({
                            data: {
                                user_id: userId,
                                comment_id: Number(commentId)
                            }
                        });

                        await tx.comment.update({
                            where: { comment_id: Number(commentId) },
                            data: {
                                comment_likes: { increment: 1 }
                            }
                        });
                    });

                    return NextResponse.json({
                        success: true,
                        message: "Comment liked successfully",
                        data: {
                            isLiked: true,
                            commentId: Number(commentId)
                        }
                    }, { status: 200 });
                }
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
                const recipe = await prisma.recipe.findUnique({
                    where: { recipe_id: Number(recipeId) },
                });

                if (!recipe) {
                    return NextResponse.json({
                        error: "Recipe not found"
                    }, { status: 404 });
                }

                if (recipe.user_id !== userId) {
                    return NextResponse.json({
                        error: "You can only delete your own recipes"
                    }, { status: 403 });
                }

                await prisma.$transaction(async (tx) => {
                    await tx.commentLike.deleteMany({
                        where: {
                            comment: {
                                recipe_id: Number(recipeId)
                            }
                        }
                    });

                    await tx.comment.deleteMany({
                        where: { recipe_id: Number(recipeId) }
                    });

                    await tx.userLike.deleteMany({
                        where: { recipe_id: Number(recipeId) }
                    });

                    await tx.bookmark.deleteMany({
                        where: { recipe_id: Number(recipeId) }
                    });

                    await tx.notification.deleteMany({
                        where: { recipe_id: Number(recipeId) }
                    });

                    await tx.instruction.deleteMany({
                        where: { recipe_id: Number(recipeId) }
                    });

                    await tx.recipeIngredient.deleteMany({
                        where: { recipe_id: Number(recipeId) }
                    });

                    await tx.recipe.delete({
                        where: { recipe_id: Number(recipeId) }
                    });
                });

                return NextResponse.json({
                    message: "Recipe and all associated data deleted successfully"
                }, { status: 200 });
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
                const commentId = searchParams.get("commentId");
                
                if (!commentId) {
                    return NextResponse.json({
                        error: "Comment ID is required"
                    }, { status: 400 });
                }

                const comment = await prisma.comment.findUnique({
                    where: { comment_id: Number(commentId) },
                    select: {
                        comment_id: true,
                        user_id: true,
                        recipe_id: true
                    }
                });

                if (!comment) {
                    return NextResponse.json({
                        error: "Comment not found"
                    }, { status: 404 });
                }

                // Only allow users to delete their own comments
                if (comment.user_id !== userId) {
                    return NextResponse.json({
                        error: "You can only delete your own comments"
                    }, { status: 403 });
                }

                // Delete comment (this will cascade delete replies and likes due to schema)
                await prisma.comment.delete({
                    where: { comment_id: Number(commentId) }
                });

                return NextResponse.json({
                    success: true,
                    message: "Comment deleted successfully",
                    data: {
                        commentId: Number(commentId)
                    }
                }, { status: 200 });
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