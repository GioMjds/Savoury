'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NewRecipeForm } from '@/types/FeedResponse';
import { toast } from 'react-toastify';
import { feed } from '@/services/Feed';
import { useRouter } from 'next/navigation';
import PostPreview from '@/components/PostPreview';

interface NewPostProps {
	userId: number;
	fullName: string;
	username: string;
	profileImage: string;
}

enum TabId {
	BASIC = 'basic',
	INGREDIENTS = 'ingredients',
	INSTRUCTIONS = 'instructions',
}

export default function PostNewRecipe({ userId, fullName, username, profileImage }: NewPostProps) {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabId>(TabId.BASIC);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
		setValue,
		watch
	} = useForm<NewRecipeForm>({
		defaultValues: {
			ingredients: [{ quantity: '', unit: '', ingredient_name: '' }],
			instructions: [{ value: '' }],
			category: '',
		},
	});

	const watchedValues = watch();

	const {
		fields: ingredientFields,
		append: appendIngredient,
		remove: removeIngredient,
	} = useFieldArray({
		control,
		name: 'ingredients',
	});

	const {
		fields: instructionFields,
		append: appendInstruction,
		remove: removeInstruction,
	} = useFieldArray({
		control,
		name: 'instructions',
	});

	const mutation = useMutation({
		mutationFn: async (data: NewRecipeForm) => {
			let imageValue: File | undefined = undefined;
			if (data.image_url instanceof FileList && data.image_url.length > 0) {
				imageValue = data.image_url[0];
			} else if (data.image_url instanceof File) {
				imageValue = data.image_url;
			} else if (typeof data.image_url === 'string' && data.image_url) {
				if (data.image_url.startsWith('data:')) {
					try {
						const response = await fetch(data.image_url);
						const blob = await response.blob();
						imageValue = new File([blob], 'recipe-image.jpg', {
							type: blob.type,
						});
					} catch (error) {
						console.error(`Error converting data URL to file: ${error}`);
					}
				}
			}

			const recipeData = {
				user_id: userId,
				title: data.title,
				description: data.description,
				image_url: imageValue,
				prep_time_minutes: data.prep_time_minutes,
				cook_time_minutes: data.cook_time_minutes,
				servings: data.servings,
				category: data.category,
				ingredients: data.ingredients,
				instructions: data.instructions,
			};
			return feed.postNewRecipe(recipeData);
		},
		onSuccess: () => {
			toast.success('Recipe posted successfully!');
			router.refresh();
			router.push('/feed');
			setImagePreview(null);
			reset();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to post recipe.');
		},
	});

	const onSubmit: SubmitHandler<NewRecipeForm> = (data) => {
		mutation.mutate(data);
	};

	const tabs = [
		{ id: TabId.BASIC, label: 'Basic Info' },
		{ id: TabId.INGREDIENTS, label: 'Ingredients' },
		{ id: TabId.INSTRUCTIONS, label: 'Instructions' },
	];

	return (
		<div className="h-screen bg-muted flex flex-col overflow-hidden">
			<div className="container mx-auto flex flex-col h-full px-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="py-4 flex-shrink-0"
				>
					{/* Top Row - Back button and Logo */}
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => router.back()}
							className="flex items-center cursor-pointer gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/50"
						>
							<FontAwesomeIcon icon={faArrowLeft} />
							Back
						</button>
						
						<div className="flex items-center gap-3">
							<Image 
								src="/savoury-logo.png"
								alt='Savoury Logo'
								width={50}
								height={50}
								priority
								className='object-contain'
							/>
							<span className="text-2xl font-bold text-primary">Savoury</span>
						</div>
					</div>
					
					{/* Center Content - Title and Description */}
					<div className="text-center">
						<h1 className="text-3xl font-bold text-foreground mb-3">
							Create New Recipe
						</h1>
						<p className="text-muted-foreground text-lg mx-auto">
							Share your culinary masterpiece with the community and inspire others with your cooking
						</p>
					</div>
				</motion.div>

				{/* Two-Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 pb-4">
					{/* Form Column */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden"
					>
						{/* Tab Navigation */}
						<div className="border-b border-border flex-shrink-0">
							<div className="flex px-6">
								{tabs.map((tab) => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`px-4 py-3 cursor-pointer font-medium text-sm relative ${
											activeTab === tab.id
												? 'text-primary'
												: 'text-muted-foreground hover:text-foreground'
										}`}
									>
										{tab.label}
										{activeTab === tab.id && (
											<motion.div
												layoutId="activeTab"
												className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
											/>
										)}
									</button>
								))}
							</div>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
							<div className="flex-1 p-6 overflow-y-auto">
								<AnimatePresence mode="wait">
								{/* Basic Info Tab */}
								{activeTab === TabId.BASIC && (
									<motion.div
										key="basic"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.2 }}
										className="space-y-4"
									>
										{/* Title */}
										<div>
											<label className="block text-sm font-medium mb-1 text-foreground">
												Recipe Name *
											</label>
											<input
												type="text"
												{...register('title', {
													required: 'Recipe Name is required',
												})}
												className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
												placeholder="Your recipe name"
											/>
											{errors.title && (
												<p className="text-error text-xs mt-1">
													{errors.title.message}
												</p>
											)}
										</div>

										{/* Category */}
										<div>
											<label className="block text-sm font-medium mb-1 text-foreground">
												Category
											</label>
											<select
												{...register('category')}
												className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
											>
												<option value="" disabled>Select a category</option>
												<option value="breakfast">Breakfast</option>
												<option value="lunch">Lunch</option>
												<option value="dinner">Dinner</option>
												<option value="dessert">Dessert</option>
												<option value="appetizer">Appetizer</option>
												<option value="snack">Snack</option>
												<option value="soup">Soup</option>
												<option value="beverage">Beverage</option>
												<option value="salad">Salad</option>
												<option value="side_dish">Side Dish</option>
											</select>
										</div>

										{/* Description */}
										<div>
											<label className="block text-sm font-medium mb-1 text-foreground">
												Description
											</label>
											<textarea
												{...register('description', {
													required: "Food recipe description is required."
												})}
												className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
												placeholder="Describe your recipe..."
												rows={8}
											/>
										</div>

										{/* Image Upload */}
										<div>
											<label className="block text-sm font-medium mb-1 text-foreground">
												Recipe Image
											</label>
											<div className="flex items-center justify-center w-full">
												<label
													htmlFor="image_url"
													className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted"
												>
													<div className="flex flex-col items-center justify-center pt-5 pb-6">
														<svg
															className="w-8 h-8 mb-4 text-muted-foreground"
															aria-hidden="true"
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 20 16"
														>
															<path
																stroke="currentColor"
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="2"
																d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
															/>
														</svg>
														<div className="mb-2 text-sm text-muted-foreground">
															<span className="font-semibold">
																Click to upload
															</span>{' '}
															or drag and drop
														</div>
														<p className="text-xs text-muted-foreground">
															PNG, JPG, GIF up to 10MB
														</p>
													</div>
													<input
														id="image_url"
														type="file"
														accept="image/*"
														className="hidden"
														{...register('image_url', {
															onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
																const file = e.target.files?.[0];
																if (file) {
																	const previewUrl = URL.createObjectURL(file);
																	setImagePreview(previewUrl);
																} else {
																	setImagePreview(null);
																}
															},
														})}
													/>
												</label>
											</div>
											{imagePreview && (
												<div className="mt-4 relative">
													<Image
														src={imagePreview}
														alt="Preview"
														width={160}
														height={160}
														priority
														className="rounded-lg border border-border object-cover h-80 w-full"
													/>
													<button
														type="button"
														onClick={() => {
															setImagePreview(null);
															setValue('image_url', null);
														}}
														className="absolute top-2 cursor-pointer right-2 p-1 bg-white rounded-full shadow hover:bg-muted transition-colors"
														aria-label="Remove image"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 20 20"
															className="w-5 h-5 text-error"
														>
															<path
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M6 6l8 8M6 14L14 6"
															/>
														</svg>
													</button>
												</div>
											)}
										</div>

										{/* Time and Servings */}
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div>
												<label className="block text-sm font-medium mb-1 text-foreground">
													Prep Time (min)
												</label>
												<input
													type="number"
													min={0}
													{...register('prep_time_minutes', {
														valueAsNumber: true,
													})}
													className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1 text-foreground">
													Cook Time (min)
												</label>
												<input
													type="number"
													min={0}
													{...register('cook_time_minutes', {
														valueAsNumber: true,
													})}
													className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1 text-foreground">
													Servings
												</label>
												<input
													type="number"
													min={1}
													{...register('servings', {
														valueAsNumber: true,
													})}
													className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
										</div>
									</motion.div>
								)}

								{/* Ingredients Tab */}
								{activeTab === TabId.INGREDIENTS && (
									<motion.div
										key="ingredients"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.2 }}
										className="space-y-4"
									>
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-medium text-foreground">
												Ingredients
											</h3>
											<button
												type="button"
												onClick={() => appendIngredient({ quantity: '', unit: '', ingredient_name: '' })}
												className="text-sm text-primary hover:text-primary-hover font-medium"
											>
												+ Add Ingredient
											</button>
										</div>

										{/* Ingredient Headers */}
										<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
											<div className="w-20">Quantity</div>
											<div className="w-24">Unit</div>
											<div className="flex-1">Ingredient</div>
											<div className="w-10"></div> {/* Space for delete button */}
										</div>

										{ingredientFields.map((field, index) => (
											<div
												key={field.id}
												className="flex items-start gap-2"
											>
												<div className="w-20">
													<input
														{...register(`ingredients.${index}.quantity`)}
														className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
														placeholder="2"
														type="number"
														step="0.25"
														min="0"
													/>
												</div>
												<div className="w-24">
													<select
														{...register(`ingredients.${index}.unit`)}
														className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
													>
														<option value="" disabled>Select Unit</option>
														<option value="cup">cup</option>
														<option value="cups">cups</option>
														<option value="tsp">tsp</option>
														<option value="tbsp">tbsp</option>
														<option value="oz">oz</option>
														<option value="lb">lb</option>
														<option value="g">g</option>
														<option value="kg">kg</option>
														<option value="ml">ml</option>
														<option value="l">l</option>
														<option value="pint">pint</option>
														<option value="quart">quart</option>
														<option value="gallon">gallon</option>
														<option value="piece">piece</option>
														<option value="slice">slice</option>
														<option value="clove">clove</option>
														<option value="can">can</option>
														<option value="jar">jar</option>
														<option value="package">package</option>
														<option value="pinch">pinch</option>
														<option value="dash">dash</option>
													</select>
												</div>
												<div className="flex-1">
													<input
														{...register(
															`ingredients.${index}.ingredient_name` as const,
															{ required: 'Ingredient name is required' }
														)}
														className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
														placeholder="flour, salt, chicken breast..."
													/>
												</div>
												{ingredientFields.length > 1 && (
													<button
														type="button"
														onClick={() => removeIngredient(index)}
														className="p-2 text-error hover:bg-error-light rounded-full"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path
																fillRule="evenodd"
																d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
																clipRule="evenodd"
															/>
														</svg>
													</button>
												)}
											</div>
										))}
									</motion.div>
								)}

								{/* Instructions Tab */}
								{activeTab === TabId.INSTRUCTIONS && (
									<motion.div
										key="instructions"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.2 }}
										className="space-y-4"
									>
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-medium text-foreground">
												Instructions
											</h3>
											<button
												type="button"
												onClick={() => appendInstruction({ value: '' })}
												className="text-sm text-primary hover:text-primary-hover font-medium"
											>
												+ Add Step
											</button>
										</div>

										{instructionFields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary-light text-white font-medium mt-2">
													{index + 1}
												</div>
												<div className="flex-1">
													<textarea
														{...register(`instructions.${index}.value`)}
														className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
														placeholder="Describe this step..."
														rows={4}
													/>
												</div>
												{instructionFields.length > 1 && (
													<button
														type="button"
														onClick={() => removeInstruction(index)}
														className="p-2 text-error hover:bg-error-light rounded-full self-start mt-2"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path
																fillRule="evenodd"
																d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
																clipRule="evenodd"
															/>
														</svg>
													</button>
												)}
											</div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
							</div>

							{/* Navigation and Submit Buttons */}
							<div className="flex justify-between px-6 py-4 border-t border-border flex-shrink-0">
								<div>
									{activeTab !== TabId.BASIC && (
										<button
											type="button"
											onClick={() => {
												const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
												setActiveTab(tabs[currentIndex - 1].id);
											}}
											className="px-4 py-2 cursor-pointer text-foreground hover:bg-muted rounded-lg font-medium"
										>
											Back
										</button>
									)}
								</div>

								<div className="flex gap-2">
									{activeTab !== TabId.INSTRUCTIONS ? (
										<button
											type="button"
											onClick={() => {
												const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
												setActiveTab(tabs[currentIndex + 1].id);
											}}
											className="px-4 py-2 cursor-pointer bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
										>
											Continue
										</button>
									) : (
										<motion.button
											type="submit"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.97 }}
											disabled={mutation.isPending}
											className="px-6 py-2 cursor-pointer bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
										>
											{mutation.isPending ? (
												<span className="flex items-center">
													<svg
														className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
													>
														<circle
															className="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="4"
														></circle>
														<path
															className="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Posting...
												</span>
											) : (
												'Post Recipe'
											)}
										</motion.button>
									)}
								</div>
							</div>
						</form>
					</motion.div>

					{/* Preview Column */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="flex flex-col overflow-hidden"
					>
						<div className="overflow-y-auto">
							<PostPreview
								title={watchedValues.title}
								fullName={fullName}
								username={username}
								profileImage={profileImage}
								description={watchedValues.description}
								imagePreview={imagePreview}
								prepTime={watchedValues.prep_time_minutes}
								cookTime={watchedValues.cook_time_minutes}
								servings={watchedValues.servings}
								category={watchedValues.category}
								ingredients={watchedValues.ingredients}
								instructions={watchedValues.instructions}
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
