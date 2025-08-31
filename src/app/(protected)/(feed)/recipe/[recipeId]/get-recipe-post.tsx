'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { recipe } from '@/services/Recipe';
import { formatDate, formatTime, formatCategory } from '@/utils/formaters';
import type { Recipe } from '@/types/RecipeResponse';
import Image from 'next/image';
import StatCard from '@/components/StatCard';
import TabButton from '@/components/TabButton';

interface RecipePostProps {
	recipeId: number;
}

export default function GetRecipePost({ recipeId }: RecipePostProps) {
	const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>(
		'ingredients'
	);

	const { data } = useQuery({
		queryKey: ['recipeId', recipeId],
		queryFn: () => recipe.getRecipe(recipeId),
		refetchOnWindowFocus: false,
	});

	const recipeData: Recipe = data.recipe;
	const averageRating =
		recipeData.ratings.length > 0
			? recipeData.ratings.reduce((sum, r) => sum + r.rating, 0) /
			  recipeData.ratings.length
			: 0;

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto pt-20 px-4 py-8">
				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Left Column - Recipe Content */}
					<div className="lg:col-span-3">
						{/* Header Section */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
						>
							<div className="flex flex-col md:flex-row">
								{/* Recipe Image */}
								<div className="md:w-1/2 relative h-64 md:h-auto">
									<Image
										src={recipeData.image_url as string}
										alt={recipeData.title}
										fill
										loading="lazy"
										className="object-cover"
									/>
									{/* Category Badge */}
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.3 }}
										className="absolute top-4 left-4"
									>
										<span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground shadow-md">
											{formatCategory(recipeData?.category)}
										</span>
									</motion.div>

									{/* Rating Badge */}
									{averageRating > 0 && (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.4 }}
											className="absolute top-4 right-4"
										>
											<div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground shadow-md flex items-center gap-1">
												<span className="text-yellow-500">
													⭐
												</span>
												<span>
													{averageRating.toFixed(1)}
												</span>
												<span className="text-muted">
													({recipeData.ratings.length})
												</span>
											</div>
										</motion.div>
									)}
								</div>

								{/* Recipe Info */}
								<div className="md:w-1/2 p-6">
									<motion.h1
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="text-3xl md:text-4xl font-bold text-foreground mb-4"
									>
										{recipeData.title}
									</motion.h1>

									{/* Author Info */}
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.3 }}
										className="flex items-center gap-4 mb-4"
									>
										<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center overflow-hidden">
											<Image
												src={recipeData.user.profile_image}
												alt={recipeData.user.fullname}
												width={48}
												height={48}
												priority
												className="w-full h-full object-cover"
											/>
										</div>
										<div>
											<p className="font-semibold text-foreground">
												{recipeData.user.fullname}
											</p>
											<p className="text-sm text-muted">
												@{recipeData.user.username}
											</p>
										</div>
										<div className="text-sm text-muted ml-auto">
											{formatDate(recipeData.created_at)}
										</div>
									</motion.div>

									{/* Description */}
									{recipeData.description && (
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.4 }}
											className="text-muted leading-relaxed mb-6"
										>
											{recipeData.description}
										</motion.p>
									)}

									{/* Recipe Stats */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 }}
										className="grid grid-cols-2 gap-4"
									>
										<StatCard
											icon="⏱️"
											label="Prep Time"
											value={formatTime(Number(recipeData.prep_time_minutes))}
										/>
										<StatCard
											icon="🔥"
											label="Cook Time"
											value={formatTime(Number(recipeData.cook_time_minutes))}
										/>
										<StatCard
											icon="👥"
											label="Servings"
											value={recipeData.servings ? `${recipeData.servings} people` : 'N/A'}
										/>
										<StatCard
											icon="💬"
											label="Comments"
											value={`${recipeData.comments.length}`}
										/>
									</motion.div>
								</div>
							</div>
						</motion.div>

						{/* Ingredients & Instructions Section */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.6 }}
							className="bg-white rounded-xl shadow-lg overflow-hidden"
						>
							{/* Tab Navigation */}
							<div className="flex border-b border-border">
								<TabButton
									active={activeTab === 'ingredients'}
									onClick={() => setActiveTab('ingredients')}
									icon="🥕"
									label={`Ingredients (${recipeData.recipeIngredients.length})`}
								/>
								<TabButton
									active={activeTab === 'instructions'}
									onClick={() => setActiveTab('instructions')}
									icon="📝"
									label={`Instructions (${recipeData.instructions.length})`}
								/>
							</div>

							{/* Tab Content */}
							<div className="p-6">
								<AnimatePresence mode="wait">
									{activeTab === 'ingredients' ? (
										<motion.div
											key="ingredients"
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -20 }}
											transition={{ duration: 0.3 }}
											className="space-y-3"
										>
											{recipeData.recipeIngredients.map(
												(ingredient, index) => (
													<motion.div
														key={index}
														initial={{
															opacity: 0,
															y: 10,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														transition={{
															delay: index * 0.05,
														}}
														className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
													>
														<div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
														<span className="font-medium text-primary min-w-[80px]">
															{ingredient.quantity}{' '}
															{ingredient.unit}
														</span>
														<span className="text-foreground capitalize">
															{ingredient.ingredient.ingredient_name}
														</span>
													</motion.div>
												)
											)}
										</motion.div>
									) : (
										<motion.div
											key="instructions"
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -20 }}
											transition={{ duration: 0.3 }}
											className="space-y-4"
										>
											{recipeData.instructions.map(
												(instruction, index) => (
													<motion.div
														key={index}
														initial={{
															opacity: 0,
															y: 10,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														transition={{
															delay: index * 0.1,
														}}
														className="flex gap-4 p-4 rounded-lg bg-muted"
													>
														<div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
															{instruction.step_number}
														</div>
														<p className="text-foreground leading-relaxed">
															{instruction.step_text}
														</p>
													</motion.div>
												)
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					</div>

					{/* Right Column - Comments Sidebar */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.7 }}
						className="lg:col-span-1"
					>
						<div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
							<div className="p-4 border-b border-border">
								<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
									💬 Comments ({recipeData.comments.length})
								</h3>
							</div>
							<div className="p-4 max-h-[calc(100vh-150px)] overflow-y-auto">
								{recipeData.comments.length > 0 ? (
									<div className="space-y-4">
										{recipeData.comments.map(
											(comment, index) => (
												<motion.div
													key={comment.comment_id}
													initial={{
														opacity: 0,
														y: 10,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														delay:
															0.8 + index * 0.1,
													}}
													className="p-3 rounded-lg bg-muted"
												>
													<p className="text-foreground text-sm leading-relaxed">
														{comment.comment_text}
													</p>
												</motion.div>
											)
										)}
									</div>
								) : (
									<div className="text-center py-8">
										<div className="text-4xl mb-2">💭</div>
										<p className="text-muted text-sm">
											No comments yet
										</p>
										<p className="text-muted text-xs">
											Be the first to share your thoughts!
										</p>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
