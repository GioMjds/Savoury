import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
	try {
		return NextResponse.json(
			{
				message: 'Feed data fetched successfully',
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				error: `/feed GET error: ${error}`,
			},
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const action = searchParams.get('feed_action');

		switch (action) {
			case 'post_new_recipe': {
				const formData = await req.formData();

				for (const [key, value] of formData.entries()) {
					if (value instanceof File) {
						console.log(
							`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`
						);
					} else {
						console.log(`${key}:`, value);
					}
				}

				const user_id = formData.get('user_id') as string;
				const title = formData.get('title') as string;
				const description = formData.get('description') as string;
				const prep_time_minutes = formData.get('prep_time_minutes');
				const cook_time_minutes = formData.get('cook_time_minutes');
				const servings = formData.get('servings') as string;
				const ingredientsJson = formData.get('ingredients') as string;
				const instructionsJson = formData.get('instructions') as string;
				const imageFile = formData.get('image_url') as File | null;

				if (imageFile) {
					console.log('Image file details:', {
						name: imageFile.name,
						size: imageFile.size,
						type: imageFile.type,
						lastModified: imageFile.lastModified,
					});

					if (imageFile.size === 0) {
						console.warn('Image file has 0 size - might be empty');
					}
				} else {
					console.log('No image file found in form data');
				}

				// Parse JSON fields
				let ingredients, instructions;
				try {
					ingredients = ingredientsJson
						? JSON.parse(ingredientsJson)
						: [];
					instructions = instructionsJson
						? JSON.parse(instructionsJson)
						: [];
				} catch (parseError) {
					return NextResponse.json(
						{
							error: 'Invalid JSON format for ingredients or instructions',
						},
						{ status: 400 }
					);
				}

				if (!user_id || !title) {
					return NextResponse.json(
						{
							error: 'Missing required fields: user_id and title are required.',
						},
						{ status: 400 }
					);
				}

				const user = await prisma.users.findUnique({
					where: { user_id: Number(user_id) },
					select: { user_id: true, username: true },
				});

				if (!user) {
					return NextResponse.json(
						{
							error: 'No user session found.',
						},
						{ status: 403 }
					);
				}

				if (!ingredients || ingredients.length === 0) {
					return NextResponse.json(
						{
							error: 'At least one ingredient is required.',
						},
						{ status: 400 }
					);
				}

				if (!instructions || instructions.length === 0) {
					return NextResponse.json(
						{
							error: 'At least one instruction step is required.',
						},
						{ status: 400 }
					);
				}

				let image_url: string = '';
				if (imageFile && imageFile.size > 0) {
					console.log('Processing image upload...');

					try {
						// Use upload_stream for better handling
						const arrayBuffer = await imageFile.arrayBuffer();
						const buffer = Buffer.from(arrayBuffer);

						const uploadResult = await new Promise<any>(
							(resolve, reject) => {
								const uploadStream =
									cloudinary.uploader.upload_stream(
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
												console.error(
													'Cloudinary upload error:',
													error
												);
												reject(error);
											} else {
												resolve(result);
											}
										}
									);

								uploadStream.end(buffer);
							}
						);

						console.log('Cloudinary upload successful:', {
							url: uploadResult.secure_url,
							public_id: uploadResult.public_id,
						});

						image_url = uploadResult.secure_url;
					} catch (error) {
						console.error('Cloudinary upload failed:', error);
					}
				}

				const recipe = await prisma.recipe.create({
					data: {
						user_id: Number(user_id),
						title: title,
						description: description,
						image_url: image_url,
						prep_time_minutes: Number(prep_time_minutes),
						cook_time_minutes: Number(cook_time_minutes),
						servings: Number(servings),
					},
				});

				if (ingredients && ingredients.length > 0) {
					const ingredientData = await Promise.all(
						ingredients.map(
							async (
								ingredient: { value: string },
								index: number
							) => {
								const parts = ingredient.value
									.trim()
									.split(' ');
								const quantity = parts[0];
								const unit = parts.length > 2 ? parts[1] : null;
								const ingredientName =
									parts.length > 2
										? parts.slice(2).join(' ')
										: parts.slice(1).join(' ');

								// Find or create the ingredient
								let ingredientRecord =
									await prisma.ingredient.findUnique({
										where: {
											ingredient_name: ingredientName,
										},
									});

								if (!ingredientRecord) {
									ingredientRecord =
										await prisma.ingredient.create({
											data: {
												ingredient_name: ingredientName,
											},
										});
								}

								return {
									recipe_id: recipe.recipe_id,
									ingredient_id:
										ingredientRecord.ingredient_id,
									quantity: quantity,
									unit: unit,
								};
							}
						)
					);

					await prisma.recipeIngredient.createMany({
						data: ingredientData,
					});
				}

				if (instructions && instructions.length > 0) {
					const instructionData = instructions.map(
						(instruction: { value: string }, index: number) => ({
							recipe_id: recipe.recipe_id,
							step_number: index + 1,
							step_text: instruction.value,
						})
					);
					await prisma.instruction.createMany({
						data: instructionData,
					});
				}

				return NextResponse.json(
					{
						message: 'Recipe created successfully!',
						recipe: {
							user: recipe.user_id,
							recipe_id: recipe.recipe_id,
							title: recipe.title,
							description: recipe.description,
							image_url: recipe.image_url,
							prep_time_minutes: recipe.prep_time_minutes,
							cook_time_minutes: recipe.cook_time_minutes,
							servings: recipe.servings,
							created_at: recipe.created_at,
						},
					},
					{ status: 201 }
				);
			}
			default: {
				return NextResponse.json(
					{
						error: 'Unknown feed action',
					},
					{ status: 400 }
				);
			}
		}
	} catch (error) {
		return NextResponse.json(
			{
				error: `/feed POST error: ${error}`,
			},
			{ status: 500 }
		);
	}
}
