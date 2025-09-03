import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { FoodCategories } from '@/types/FeedResponse';
import { getSession } from '@/lib/auth';

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
						select: {
							comment_id: true,
							comment_text: true
						}
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
				}
			});

			const publicRecipesWithFlags = publicRecipes.map(recipe => ({
				...recipe,
				isLiked: recipe.userLikes.length > 0,
				isBookmarked: recipe.bookmarks.length > 0,
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
                    select: {
                        comment_id: true,
                        comment_text: true
                    }
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
            }
        });

        const recipesWithFlags = recipes.map(recipe => {
            const isLiked = recipe.userLikes.length > 0;
            const isBookmarked = recipe.bookmarks.length > 0;

            return {
                ...recipe,
                isLiked,
                isBookmarked
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
				const prep_time_minutes = formData.get('prep_time_minutes');
				const cook_time_minutes = formData.get('cook_time_minutes');
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
						prep_time_minutes: Number(prep_time_minutes),
						cook_time_minutes: Number(cook_time_minutes),
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

				return NextResponse.json({
					message: 'Recipe created successfully!',
					recipe: {
						user: recipe.user_id,
						recipe_id: recipe.recipe_id,
						title: recipe.title,
						category: recipe.category,
						description: recipe.description,
						image_url: recipe.image_url,
						prep_time_minutes: recipe.prep_time_minutes,
						cook_time_minutes: recipe.cook_time_minutes,
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
