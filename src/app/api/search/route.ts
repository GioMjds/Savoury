import { type NextRequest, NextResponse } from "next/server";
import { elasticClient } from "@/configs/elasticsearch";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('q')?.trim();

        if (!query) {
            return NextResponse.json({
                error: "Query parameter 'q' is required."
            }, { status: 400 });
        }

        // --- Recipe Search via Elasticsearch ---
        const esResult = await elasticClient.search({
            index: 'savoury-index',
            size: 10,
            query: {
                bool: {
                    should: [
                        {
                            multi_match: {
                                query: query,
                                fields: [
                                    "title^4", 
                                    "username^3", 
                                    "fullname^3"
                                ],
                                type: "phrase_prefix"
                            }
                        },
                        {
                            multi_match: {
                                query: query,
                                fields: [
                                    "title^3", 
                                    "description", 
                                    "category", 
                                    "user^2", 
                                    "username^2", 
                                    "fullname^2", 
                                    "ingredients.ingredient_name"
                                ],
                                fuzziness: 'AUTO'
                            }
                        },
                        {
                            query_string: {
                                query: `*${query}*`,
                                fields: [
                                    "username^2", 
                                    "fullname^2", 
                                    "title^2"
                                ],
                                boost: 1.5
                            }
                        }
                    ],
                    minimum_should_match: 1
                }
            }
        });

        const recipeIds = esResult.hits?.hits?.map(hit => Number((hit._source as any)?.recipe_id)) ?? [];

        const users = await prisma.users.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { fullname: { contains: query, mode: "insensitive" } }
                ]
            },
            select: {
                user_id: true,
                username: true,
                fullname: true,
                profile_image: true,
                cover_photo: true,
                bio: true,
                gender: true,
                pronouns: true,
                social_links: true,
                created_at: true
            },
            take: 10
        });

        // --- Recipe Details via Prisma ---
        let recipes: any[] = [];
        if (recipeIds.length > 0) {
            recipes = await prisma.recipe.findMany({
                where: { recipe_id: { in: recipeIds } },
                include: {
                    user: {
                        select: {
                            user_id: true,
                            username: true,
                            fullname: true,
                            profile_image: true
                        }
                    },
                    recipeIngredients: {
                        include: { ingredient: true }
                    },
                    instructions: { orderBy: { step_number: 'asc' } },
                    comments: {
                        where: { parent_comment_id: null },
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    username: true,
                                    fullname: true,
                                    profile_image: true
                                }
                            },
                            likes: { select: { user_id: true } },
                            replies: {
                                include: {
                                    user: {
                                        select: {
                                            user_id: true,
                                            username: true,
                                            fullname: true,
                                            profile_image: true
                                        }
                                    },
                                    likes: { select: { user_id: true } }
                                },
                                orderBy: { created_at: 'asc' },
                                take: 2
                            }
                        },
                        orderBy: { created_at: 'desc' },
                        take: 3
                    },
                    userLikes: {
                        select: {
                            user_like_id: true,
                            user_id: true,
                            created_at: true
                        }
                    },
                    bookmarks: { select: { user_id: true } },
                    _count: {
                        select: {
                            comments: true,
                            userLikes: true
                        }
                    }
                }
            });
        }

        const recipesSorted = recipeIds.map(id => recipes.find(r => r.recipe_id === id)).filter(Boolean);

        return NextResponse.json({
            recipes: recipesSorted,
            users,
            totalRecipes: typeof esResult.hits?.total === 'number'
                ? esResult.hits.total
                : esResult.hits?.total?.value ?? recipesSorted.length,
            totalUsers: users.length
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/search GET error: ${error}`
        }, { status: 500 });
    }
}