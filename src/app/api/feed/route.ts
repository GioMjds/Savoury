import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { FoodCategories } from '@/types/FeedResponse';
import { getSession } from '@/lib/auth';
import { elasticClient } from '@/configs/elasticsearch';
import { TimeUnit } from '@prisma/client';
import { validateRecipeForm, validateIngredients, validateInstructions, validateTimeAndServings } from '@/utils/validation';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        
        if (!session || !session.userId) {
            const publicRecipes = await prisma.recipe.findMany({
                orderBy: { created_at: 'desc' },
                include: {
                    user: {
                        select: {
                            user_id: true,
                            fullname: true,
                            username: true,
                            profile_image: true
                        }
                    },
                    recipeIngredients: {
                        include: {
                            ingredient: true
                        }
                    },
                    instructions: {
                        orderBy: { step_number: 'asc' }
                    },
                    comments: {
                        where: {
                            parent_comment_id: null
                        },
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    username: true,
                                    fullname: true,
                                    profile_image: true,
                                }
                            },
                            likes: {
                                select: {
                                    user_id: true
                                }
                            },
                            replies: {
                                include: {
                                    user: {
                                        select: {
                                            user_id: true,
                                            username: true,
                                            fullname: true,
                                            profile_image: true,
                                        }
                                    },
                                    likes: {
                                        select: {
                                            user_id: true
                                        }
                                    }
                                },
                                orderBy: {
                                    created_at: 'asc'
                                },
                                take: 2 // Limit replies shown in feed
                            }
                        },
                        orderBy: {
                            created_at: 'desc'
                        },
                        take: 3, // Limit to latest 3 comments for performance
                    },
                    userLikes: {
                        select: {
                            user_like_id: true,
                            user_id: true,
                            created_at: true,
                        }
                    },
                    bookmarks: {
                        select: {
                            user_id: true
                        }
                    },
                    _count: {
                        select: {
                            comments: true, // Get total comment count
                        }
                    }
                }
            });

            const publicRecipesWithFlags = publicRecipes.map(recipe => ({
                ...recipe,
                isLiked: recipe.userLikes.length > 0,
                isBookmarked: recipe.bookmarks.length > 0,
                totalComments: recipe._count.comments,
            }));

            return NextResponse.json({
                message: "Public recipe posts retrieved successfully",
                feed: publicRecipesWithFlags,
            }, { status: 200 });
        }

        const userId = session.userId;

        const recipes = await prisma.recipe.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                user: {
                    select: {
                        user_id: true,
                        fullname: true,
                        username: true,
                        profile_image: true
                    }
                },
                recipeIngredients: {
                    include: {
                        ingredient: true
                    }
                },
                instructions: {
                    orderBy: { step_number: 'asc' }
                },
                comments: {
                    where: {
                        parent_comment_id: null // Only get top-level comments for feed
                    },
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                username: true,
                                fullname: true,
                                profile_image: true,
                            }
                        },
                        likes: {
                            select: {
                                user_id: true
                            }
                        },
                        replies: {
                            include: {
                                user: {
                                    select: {
                                        user_id: true,
                                        username: true,
                                        fullname: true,
                                        profile_image: true,
                                    }
                                },
                                likes: {
                                    select: {
                                        user_id: true
                                    }
                                }
                            },
                            orderBy: {
                                created_at: 'asc'
                            },
                            take: 2 // Limit replies shown in feed
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 3, // Limit to latest 3 comments for performance
                },
                userLikes: {
                    where: { user_id: userId }, // Only get current user's likes
                    select: {
                        user_like_id: true,
                        user_id: true,
                        created_at: true,
                    }
                },
                bookmarks: {
                    where: { user_id: userId }, // Only get current user's bookmarks
                    select: {
                        user_id: true
                    }
                },
                _count: {
                    select: {
                        comments: true, // Get total comment count
                        userLikes: true, // Get total likes count
                    }
                }
            }
        });

        const recipesWithFlags = recipes.map(recipe => {
            const isLiked = recipe.userLikes.length > 0;
            const isBookmarked = recipe.bookmarks.length > 0;

            return {
                ...recipe,
                isLiked,
                isBookmarked,
                likes: recipe._count.userLikes, // Set actual likes count
                totalComments: recipe._count.comments,
            };
        });

        return NextResponse.json({
            message: "Recipe posts retrieved successfully",
            feed: recipesWithFlags,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/feed GET error: ${error}`,
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const action = searchParams.get('feed_action');

		switch (action) {
			case 'post_new_recipe': {
				const formData = await req.formData();

				const user_id = formData.get('user_id') as string;
				const title = formData.get('title') as string;
				const category = formData.get('category') as FoodCategories;
				const description = formData.get('description') as string;
				const prep_time_value = formData.get('prep_time_value');
				const prep_time_unit = formData.get('prep_time_unit') as string;
				const cook_time_value = formData.get('cook_time_value');
				const cook_time_unit = formData.get('cook_time_unit') as string;
				const servings = formData.get('servings') as string;
				const ingredientsJson = formData.get('ingredients') as string;
				const instructionsJson = formData.get('instructions') as string;
				const imageFile = formData.get('image_url') as File | null;

				let ingredients, instructions;

				try {
					ingredients = ingredientsJson
						? JSON.parse(ingredientsJson)
						: [];
					instructions = instructionsJson
						? JSON.parse(instructionsJson)
						: [];
				} catch (parseError) {
					return NextResponse.json({
						error: 'Invalid JSON format for ingredients or instructions',
					}, { status: 400 });
				}

				if (!user_id || !title) {
					return NextResponse.json({
						error: 'Missing required fields: user_id and title are required.',
					}, { status: 400 });
				}

				const user = await prisma.users.findUnique({
					where: { user_id: Number(user_id) },
					select: { user_id: true, username: true },
				});

				if (!user) {
					return NextResponse.json({
						error: 'No user session found.',
					}, { status: 403 });
				}

                if (!category) {
                    return NextResponse.json({
                        error: 'Invalid category selected.',
                    }, { status: 400 });
                }

				if (!ingredients || ingredients.length === 0) {
					return NextResponse.json({
						error: 'At least one ingredient is required.',
					}, { status: 400 });
				}

				if (!instructions || instructions.length === 0) {
					return NextResponse.json({
						error: 'At least one instruction step is required.',
					}, { status: 400 });
				}

				if (!instructions || instructions.length === 0) {
					return NextResponse.json({
						error: 'At least one instruction step is required.',
					}, { status: 400 });
				}

				let image_url: string = '';
				if (imageFile && imageFile.size > 0) {
					try {
						const arrayBuffer = await imageFile.arrayBuffer();
                            const recipeData = {
                                title,
                                description,
                                category,
                            };
                            const prepTimeValue = prep_time_value ? Number(prep_time_value) : undefined;
                            const cookTimeValue = cook_time_value ? Number(cook_time_value) : undefined;
                            const servingsValue = servings ? Number(servings) : undefined;

                            const formErrors = validateRecipeForm(recipeData);
                            const ingredientErrors = validateIngredients(ingredients);
                            const instructionErrors = validateInstructions(instructions);
                            const timeErrors = validateTimeAndServings(
                                prepTimeValue,
                                prep_time_unit,
                                cookTimeValue,
                                cook_time_unit,
                                servingsValue
                            );

                            const allErrors = {
                                ...formErrors,
                                ...ingredientErrors,
                                ...instructionErrors,
                                ...timeErrors,
                            };

                            if (Object.keys(allErrors).length > 0) {
                                return NextResponse.json({
                                    error: 'Validation failed',
                                    details: allErrors,
                                }, { status: 400 });
                            }

						const buffer = Buffer.from(arrayBuffer);

						const uploadResult = await new Promise<any>((resolve, reject) => {
							const uploadStream = cloudinary.uploader.upload_stream(
								{
									resource_type: 'image',
									folder: 'savoury/recipes',
									transformation: [
										{
											width: 800,
											height: 600,
											crop: 'limit',
										},
										{ quality: 'auto' },
										{ fetch_format: 'auto' },
									],
								},
								(error, result) => {
									if (error) {
										reject(error);
									} else {
										resolve(result);
									}
								}
							);
							uploadStream.end(buffer);
						});
						image_url = uploadResult.secure_url;
					} catch (error) {
						console.error(`Cloudinary upload failed: ${error}`);
						image_url = '';
					}
				}

				const recipe = await prisma.recipe.create({
					data: {
						user_id: Number(user_id),
						title: title,
						category: category,
						description: description,
						image_url: image_url,
						prep_time_value: prep_time_value ? Number(prep_time_value) : null,
						prep_time_unit: prep_time_unit ? (prep_time_unit as TimeUnit) : null,
						cook_time_value: cook_time_value ? Number(cook_time_value) : null,
						cook_time_unit: cook_time_unit ? (cook_time_unit as TimeUnit) : null,
						servings: Number(servings),
					},
				});

				if (ingredients && ingredients.length > 0) {
					const ingredientData = await Promise.all(
						ingredients
							.filter((ingredient: { quantity?: number | string, unit?: string, ingredient_name: string }) => 
								ingredient.ingredient_name && ingredient.ingredient_name.trim())
							.map(async (ingredient: { quantity?: number | string, unit?: string, ingredient_name: string }) => {
								const ingredientName = ingredient.ingredient_name.trim();
								let quantity: number | null = null;
								let unit: string | null = null;

								if (ingredient.quantity !== undefined && ingredient.quantity !== null && ingredient.quantity !== '') {
									const quantityValue = typeof ingredient.quantity === 'string' 
										? parseFloat(ingredient.quantity) 
										: ingredient.quantity;
									if (!isNaN(quantityValue) && isFinite(quantityValue)) {
										quantity = quantityValue;
									}
								}

								if (ingredient.unit && ingredient.unit.trim()) {
									unit = ingredient.unit.toLowerCase().trim();
								}

								const normalizedName = ingredientName.toLowerCase().trim();

								let ingredientRecord = await prisma.ingredient.findUnique({
									where: { ingredient_name: normalizedName },
								});

								if (!ingredientRecord) {
									ingredientRecord = await prisma.ingredient.create({
										data: { ingredient_name: normalizedName },
									});
								}

								return {
									recipe_id: recipe.recipe_id,
									ingredient_id: ingredientRecord.ingredient_id,
									quantity: quantity,
									unit: unit,
								};
							})
					);

					const validIngredientData = ingredientData.filter(item => item !== null);

					if (validIngredientData.length > 0) {
						await prisma.recipeIngredient.createMany({
							data: validIngredientData,
						});
					}
				}

				if (instructions && instructions.length > 0) {
					const instructionData = instructions
						.filter((instruction: { value: string }) => 
							instruction.value && instruction.value.trim())
						.map((instruction: { value: string }, index: number) => ({
							recipe_id: recipe.recipe_id,
							step_number: index + 1,
							step_text: instruction.value.trim(),
						}));
					
					if (instructionData.length > 0) {
						await prisma.instruction.createMany({
							data: instructionData,
						});
					}
				}

                await elasticClient.index({
                    index: 'savoury-index',
                    id: recipe.recipe_id.toString(),
                    document: {
                        recipe_id: recipe.recipe_id,
                        user_id: recipe.user_id,
                        title: recipe.title,
                        category: recipe.category,
                        description: recipe.description,
                        image_url: recipe.image_url,
                        prep_time_value: recipe.prep_time_value,
                        prep_time_unit: recipe.prep_time_unit,
                        cook_time_value: recipe.cook_time_value,
                        cook_time_unit: recipe.cook_time_unit,
                        servings: recipe.servings,
                        created_at: recipe.created_at,
                    }
                });

				return NextResponse.json({
					message: 'Recipe created successfully!',
					recipe: {
						user: recipe.user_id,
						recipe_id: recipe.recipe_id,
						title: recipe.title,
						category: recipe.category,
						description: recipe.description,
						image_url: recipe.image_url,
						prep_time_value: recipe.prep_time_value,
						prep_time_unit: recipe.prep_time_unit,
						cook_time_value: recipe.cook_time_value,
						cook_time_unit: recipe.cook_time_unit,
						servings: recipe.servings,
						created_at: recipe.created_at,
					},
				}, { status: 201 });
			}
			default: {
				return NextResponse.json({
					error: 'Invalid action',
				}, { status: 400 });
			}
		}
	} catch (error) {
		return NextResponse.json({
			error: `/feed POST error: ${error}`,
		}, { status: 500 });
	}
}
