'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { NewRecipeForm } from '@/types/FeedResponse';
import { toast } from 'react-toastify';
import { feed } from '@/services/Feed';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

enum TabId {
	BASIC = 'basic',
	INGREDIENTS = 'ingredients',
	INSTRUCTIONS = 'instructions',
}

export default function PostNewRecipe({ userId }: { userId: number }) {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabId>(TabId.BASIC);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
		setValue
	} = useForm<NewRecipeForm>({
		defaultValues: {
			ingredients: [{ value: '' }],
			instructions: [{ value: '' }],
		},
	});

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

			console.log('Form data image_url:', data.image_url);
			console.log('Form data image_url type:', typeof data.image_url);

			// Handle FileList from input - FIXED THIS PART
			if (
				data.image_url instanceof FileList &&
				data.image_url.length > 0
			) {
				imageValue = data.image_url[0];
				console.log(
					'Extracted file from FileList:',
					imageValue.name,
					imageValue.size
				);
			}
			// Handle if it's already a File (shouldn't happen but just in case)
			else if (data.image_url instanceof File) {
				imageValue = data.image_url;
				console.log(
					'Already a File:',
					imageValue.name,
					imageValue.size
				);
			}
			// Handle string case
			else if (typeof data.image_url === 'string' && data.image_url) {
				console.log(
					'Image is a string (probably data URL):',
					data.image_url.substring(0, 50) + '...'
				);
				// Convert data URL to File object if needed
				if (data.image_url.startsWith('data:')) {
					try {
						const response = await fetch(data.image_url);
						const blob = await response.blob();
						imageValue = new File([blob], 'recipe-image.jpg', {
							type: blob.type,
						});
						console.log(
							'Converted data URL to File:',
							imageValue.name,
							imageValue.size
						);
					} catch (error) {
						console.error(
							'Error converting data URL to file:',
							error
						);
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
				ingredients: data.ingredients,
				instructions: data.instructions,
			};

			console.log('Final recipe data being sent:', {
				...recipeData,
				image_url: imageValue
					? `[File: ${imageValue.name}, ${imageValue.size} bytes]`
					: 'undefined',
			});

			return feed.postNewRecipe(recipeData);
		},

		onSuccess: () => {
			toast.success('Recipe posted successfully!');
			reset();
			router.push('/feed');
			setImagePreview(null);
			setIsSubmitting(false);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to post recipe.');
			setIsSubmitting(false);
		},
	});

	const onSubmit: SubmitHandler<NewRecipeForm> = (data) => {
		console.log(`onSubmit data: `, data);
		mutation.mutate(data);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
		} else {
			setImagePreview(null);
		}
	};

	const tabs = [
		{ id: TabId.BASIC, label: 'Basic Info' },
		{ id: TabId.INGREDIENTS, label: 'Ingredients' },
		{ id: TabId.INSTRUCTIONS, label: 'Instructions' },
	];

	return (
		<div className="min-h-screen bg-[var(--color-muted)] py-8 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
			>
				{/* Header */}
				<div className="border-b border-[var(--color-border)] p-6">
					<h1 className="text-2xl font-bold text-[var(--color-foreground)]">
						Create New Recipe
					</h1>
					<p className="text-[var(--color-muted-foreground)] mt-1">
						Share your culinary masterpiece with the community
					</p>
				</div>

				{/* Tab Navigation */}
				<div className="border-b border-[var(--color-border)]">
					<div className="flex px-6">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-4 py-3 font-medium text-sm relative ${
									activeTab === tab.id
										? 'text-[var(--color-primary)]'
										: 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
								}`}
							>
								{tab.label}
								{activeTab === tab.id && (
									<motion.div
										layoutId="activeTab"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
									/>
								)}
							</button>
						))}
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="p-6">
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
									<label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
										Recipe Name *
									</label>
									<input
										type="text"
										{...register('title', {
											required: 'Recipe Name is required',
										})}
										className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
										placeholder="Your recipe name"
									/>
									{errors.title && (
										<p className="text-[var(--color-error)] text-xs mt-1">
											{errors.title.message}
										</p>
									)}
								</div>

								{/* Description */}
								<div>
									<label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
										Description
									</label>
									<textarea
										{...register('description')}
										className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
										placeholder="Describe your recipe..."
										rows={6}
									/>
								</div>

								{/* Image Upload */}
								<div>
									<label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
										Recipe Image
									</label>
									<div className="flex items-center justify-center w-full">
										<label
											htmlFor="image_url"
											className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-muted)]"
										>
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<svg
													className="w-8 h-8 mb-4 text-[var(--color-muted-foreground)]"
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
												<p className="mb-2 text-sm text-[var(--color-muted-foreground)]">
													<span className="font-semibold">
														Click to upload
													</span>{' '}
													or drag and drop
												</p>
												<p className="text-xs text-[var(--color-muted-foreground)]">
													PNG, JPG, GIF up to 10MB
												</p>
											</div>
											<input
												id="image_url"
												type="file"
												accept="image/*"
												className="hidden"
												{...register('image_url', {
													onChange: (
														e: React.ChangeEvent<HTMLInputElement>
													) => {
														const file =
															e.target.files?.[0];
														if (file) {
															const previewUrl =
																URL.createObjectURL(
																	file
																);
															setImagePreview(
																previewUrl
															);
														} else {
															setImagePreview(
																null
															);
														}
													},
												})}
											/>
										</label>
									</div>
									{imagePreview && (
										<div className="mt-4">
											<Image
												src={imagePreview}
												alt="Preview"
												width={160}
												height={160}
												priority
												className="rounded-lg border border-[var(--color-border)] object-cover h-40 w-full"
											/>
											<button
												type="button"
												onClick={() => {
													setImagePreview(null);
													setValue('image_url', null);
												}}
												className="mt-2 text-sm text-[var(--color-error)] hover:text-[var(--color-error)]"
											>
												Remove Image
											</button>
										</div>
									)}
								</div>

								{/* Time and Servings */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
											Prep Time (min)
										</label>
										<input
											type="number"
											min={0}
											{...register('prep_time_minutes', {
												valueAsNumber: true,
											})}
											className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
											placeholder="15"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
											Cook Time (min)
										</label>
										<input
											type="number"
											min={0}
											{...register('cook_time_minutes', {
												valueAsNumber: true,
											})}
											className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
											placeholder="30"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
											Servings
										</label>
										<input
											type="number"
											min={1}
											{...register('servings', {
												valueAsNumber: true,
											})}
											className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
											placeholder="4"
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
									<h3 className="text-lg font-medium text-[var(--color-foreground)]">
										Ingredients
									</h3>
									<button
										type="button"
										onClick={() =>
											appendIngredient({ value: '' })
										}
										className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
									>
										+ Add Ingredient
									</button>
								</div>

								{ingredientFields.map((field, index) => (
									<div
										key={field.id}
										className="flex items-start gap-2"
									>
										<div className="flex-1">
											<input
												{...register(
													`ingredients.${index}.value` as const
												)}
												className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
												placeholder="e.g., 2 cups flour, 1 tsp salt..."
											/>
										</div>
										{ingredientFields.length > 1 && (
											<button
												type="button"
												onClick={() =>
													removeIngredient(index)
												}
												className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error-light)] rounded-full"
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
									<h3 className="text-lg font-medium text-[var(--color-foreground)]">
										Instructions
									</h3>
									<button
										type="button"
										onClick={() =>
											appendInstruction({ value: '' })
										}
										className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
									>
										+ Add Step
									</button>
								</div>

								{instructionFields.map((field, index) => (
									<div key={field.id} className="flex gap-4">
										<div className="flex-shrink-0 flex items-start justify-center h-10 w-10 rounded-full bg-[var(--color-primary-light)] text-white font-medium mt-2">
											{index + 1}
										</div>
										<div className="flex-1">
											<textarea
												{...register(
													`instructions.${index}.value` as const
												)}
												className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
												placeholder="Describe this step..."
												rows={2}
											/>
										</div>
										{instructionFields.length > 1 && (
											<button
												type="button"
												onClick={() =>
													removeInstruction(index)
												}
												className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error-light)] rounded-full self-start mt-2"
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

					{/* Navigation and Submit Buttons */}
					<div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
						<div>
							{activeTab !== TabId.BASIC && (
								<button
									type="button"
									onClick={() => {
										const currentIndex = tabs.findIndex(
											(tab) => tab.id === activeTab
										);
										setActiveTab(tabs[currentIndex - 1].id);
									}}
									className="px-4 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)] rounded-lg font-medium"
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
										const currentIndex = tabs.findIndex(
											(tab) => tab.id === activeTab
										);
										setActiveTab(tabs[currentIndex + 1].id);
									}}
									className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
								>
									Continue
								</button>
							) : (
								<motion.button
									type="submit"
									whileTap={{ scale: 0.97 }}
									disabled={isSubmitting}
									className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
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
		</div>
	);
}
