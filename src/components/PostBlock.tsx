'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faClock,
	faUsers,
	faUtensils,
	faHeart,
	faComment,
	faShare,
	faStar,
	faBookmark as faBookmarkSolid,
	faListUl
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { formatCategory, formatTime } from '@/utils/formaters';
import { PostBlockProps } from '@/types/RecipeResponse';
import { useBookmark } from '@/hooks/useBookmark';

const PostBlock = ({ recipe }: PostBlockProps) => {
	const totalTime = (Number(recipe.prep_time_minutes)) + (Number(recipe.cook_time_minutes));
	const averageRating = Number(recipe.average_rating);
	const ratingsCount = recipe.ratings.length;
	const commentsCount = recipe.comments.length;

	const { isBookmarked, isLoading: bookmarkLoading, toggleBookmark } = useBookmark(recipe.isBookmarked);

	const handleBookmarkClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		await toggleBookmark(recipe.recipe_id);
	};

	return (
		<motion.article
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="bg-white rounded-2xl shadow-xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300"
		>
			{/* Enhanced Header */}
			<div className="bg-gradient-to-r from-primary/5 via-primary-light/5 to-primary/5 p-6 border-b border-border">
				<div className="flex items-center gap-4 justify-between">
					<div className="flex items-center gap-4">
						<Link
							href={`/profile/${recipe.user.user_id}`}
							className="relative"
						>
							<div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
								<Image
									src={recipe.user.profile_image}
									alt={`${recipe.user.fullname}'s profile`}
									width={48}
									height={48}
									priority
									className="object-cover w-full h-full"
								/>
							</div>
						</Link>
						<div className="flex-1">
							<Link
								href={`/profile/${recipe.user.user_id}`}
								className="text-lg font-bold text-foreground leading-tight hover:text-primary transition-colors"
							>
								{recipe.user.fullname}
							</Link>
							<div className="flex items-center gap-2 text-sm text-muted">
								<span>@{recipe.user.username}</span>
								<span>•</span>
								<span>
									{new Date(recipe.created_at).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
					<button 
						onClick={handleBookmarkClick}
						disabled={bookmarkLoading}
						className={`cursor-pointer p-2 rounded-full transition-all duration-200 shadow-lg hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed ${isBookmarked ? 'text-yellow-400 bg-yellow-400/20' : 'text-muted bg-white/50 hover:bg-primary/10 hover:text-primary'}`}
						title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
					>
						<FontAwesomeIcon
							icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular}
							size="lg"
							className={`transition-colors duration-200 ${bookmarkLoading ? 'animate-pulse' : ''}`}
						/>
					</button>
				</div>
			</div>

			{/* Enhanced Recipe Image */}
			<Link
				href={`/recipe/${recipe.recipe_id}`}
				className="block relative"
			>
				<div className="relative h-72 bg-gradient-to-br from-accent via-muted to-primary-lighter overflow-hidden">
					<Image
						src={recipe.image_url as string}
						alt={recipe.title}
						fill
						priority
						className="object-cover hover:scale-105 transition-transform duration-500 ease-out"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
					
					{/* Category & Stats Overlay */}
					<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
						{recipe.category && (
							<div className="bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/20">
								{formatCategory(recipe.category)}
							</div>
						)}
						
						<div className="flex items-center gap-2">
							{totalTime > 0 && (
								<div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
									<FontAwesomeIcon icon={faClock} className="w-3 h-3" />
									{formatTime(totalTime)}
								</div>
							)}
							{recipe.servings && (
								<div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
									<FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
									{recipe.servings}
								</div>
							)}
							{averageRating > 0 && (
								<div className="bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
									<FontAwesomeIcon
										icon={faStar}
										className="text-yellow-200"
									/>
									<span>{averageRating.toFixed(1)}</span>
									<span className="opacity-75">
										({ratingsCount})
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</Link>

			{/* Enhanced Content */}
			<div className="p-8">
				{/* Title and Description */}
				<div className="mb-8">
					<Link href={`/recipe/${recipe.recipe_id}`}>
						<h2 className="text-3xl font-bold text-foreground mb-4 leading-tight hover:text-primary transition-colors line-clamp-2">
							{recipe.title}
						</h2>
					</Link>
					{recipe.description && (
						<p className="text-muted leading-relaxed line-clamp-2">
							{recipe.description}
						</p>
					)}
				</div>

				{/* Enhanced Recipe Stats */}
				<div className="bg-gradient-to-r from-muted/30 to-accent/30 rounded-2xl p-6 mb-8">
					<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
						<div className="w-2 h-2 bg-primary rounded-full"></div>
						Cooking Details
					</h3>
					<div className="grid grid-cols-3 gap-6">
						{recipe.prep_time_minutes && (
							<div className="text-center">
								<div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
									<FontAwesomeIcon icon={faClock} className="w-5 h-5 text-primary" />
								</div>
								<p className="text-sm font-medium text-muted mb-1">Prep Time</p>
								<p className="text-xl font-bold text-foreground">
									{formatTime(recipe.prep_time_minutes)}
								</p>
							</div>
						)}
						{recipe.cook_time_minutes && (
							<div className="text-center">
								<div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
									<FontAwesomeIcon icon={faUtensils} className="w-5 h-5 text-primary" />
								</div>
								<p className="text-sm font-medium text-muted mb-1">Cook Time</p>
								<p className="text-xl font-bold text-foreground">
									{formatTime(recipe.cook_time_minutes)}
								</p>
							</div>
						)}
						{recipe.servings && (
							<div className="text-center">
								<div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
									<FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-primary" />
								</div>
								<p className="text-sm font-medium text-muted mb-1">Servings</p>
								<p className="text-xl font-bold text-foreground">
									{recipe.servings}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Enhanced Content Grid */}
				<div className="grid grid-rows-1 lg:grid-rows-2 gap-8 mb-8">
					{/* Enhanced Ingredients */}
					{recipe.recipeIngredients.length > 0 && (
						<div className="bg-gradient-to-br from-success-light/30 to-success-light/10 rounded-2xl p-6 border border-success-light/30">
							<h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
								<div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
									<FontAwesomeIcon icon={faListUl} className="w-4 h-4 text-success" />
								</div>
								Ingredients ({recipe.recipeIngredients.length})
							</h4>
							<div className="space-y-3">
								{recipe.recipeIngredients.slice(0, 6).map((recipeIngredient, index) => (
									<motion.div 
										key={index} 
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="bg-white/60 rounded-lg p-3 flex items-center gap-3 shadow-sm border border-white/40"
									>
										<div className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
										<span className="text-sm text-foreground">
											{recipeIngredient.ingredient.ingredient_name}
										</span>
									</motion.div>
								))}
								{recipe.recipeIngredients.length > 6 && (
									<div className="text-center py-2">
										<span className="text-sm text-success font-medium bg-success-light/50 px-3 py-1 rounded-full">
											+{recipe.recipeIngredients.length - 6} more ingredients
										</span>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Enhanced Instructions Preview */}
					{recipe.instructions.length > 0 && (
						<div className="bg-gradient-to-br from-success-light/30 to-success-light/10 rounded-2xl p-6 border border-success-light/30">
							<h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
								<div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
									<FontAwesomeIcon icon={faListUl} className="w-4 h-4 text-success" />
								</div>
								Instructions ({recipe.instructions.length})
							</h4>
							<div className="overflow-x-auto">
								<table className="w-full">
									<tbody>
										{recipe.instructions.slice(0, 6).map((recipeInstruction, index) => (
											<motion.tr
												key={index}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
												className="border-b border-white/10 last:border-b-0"
											>
												<td className="py-3 align-top">
													<div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
														{recipeInstruction.step_number}
													</div>
												</td>
												<td className="py-3 pl-4 align-top">
													<span className="text-sm text-foreground leading-relaxed">
														{recipeInstruction.step_text}
													</span>
												</td>
											</motion.tr>
										))}
									</tbody>
								</table>
							</div>
							<div>
								{recipe.instructions.length > 6 && (
									<div className="text-center py-2">
										<span className="text-sm text-success font-medium bg-success-light/50 px-3 py-1 rounded-full">
											+{recipe.instructions.length - 6} more steps
										</span>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Enhanced Comments Preview */}
					{recipe.comments.length > 0 && (
						<div className="bg-gradient-to-br from-info-light/30 to-info-light/10 rounded-2xl p-6 border border-info-light/30">
							<h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
								<div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center">
									<FontAwesomeIcon icon={faComment} className="w-4 h-4 text-info" />
								</div>
								Recent Comments ({recipe.comments.length})
							</h4>
							<div className="space-y-3">
								{recipe.comments.slice(0, 3).map((comment, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.15 }}
										className="bg-white/60 rounded-lg p-4 shadow-sm border border-white/40"
									>
										<div className="flex gap-3">
											<div className="w-6 h-6 bg-info rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
												{index + 1}
											</div>
											<p className="text-sm text-foreground leading-relaxed">
												Latest user feedback and comments...
											</p>
										</div>
									</motion.div>
								))}
								{recipe.comments.length > 3 && (
									<div className="text-center py-2">
										<Link
											href={`/recipe/${recipe.recipe_id}#comments`}
											className="text-sm text-info font-medium bg-info-light/50 px-3 py-1 rounded-full hover:bg-info-light/70 transition-colors"
										>
											+{recipe.comments.length - 3} more comments
										</Link>
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Action Bar */}
				<div className="flex items-center justify-between pt-6 border-t border-border">
					<div className="flex items-center gap-6">
						<button className="flex items-center gap-2 text-muted hover:text-red-500 transition-all duration-200 hover:scale-105">
							<div className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
								<FontAwesomeIcon
									icon={faHeart}
									className="w-3 h-3"
								/>
							</div>
							<span className="text-sm font-medium">Like</span>
						</button>

						<Link
							href={`/recipe/${recipe.recipe_id}#comments`}
							className="flex items-center gap-2 text-muted hover:text-primary transition-all duration-200"
						>
							<div className="w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
								<FontAwesomeIcon
									icon={faComment}
									className="w-3 h-3"
								/>
							</div>
							<span className="text-sm font-medium">
								{commentsCount}
							</span>
						</Link>

						<button className="flex items-center gap-2 text-muted hover:text-primary transition-all duration-200 hover:scale-105">
							<div className="w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
								<FontAwesomeIcon
									icon={faShare}
									className="w-3 h-3"
								/>
							</div>
							<span className="text-sm font-medium">Share</span>
						</button>
					</div>

					<motion.div 
						whileHover={{ scale: 1.05 }} 
						whileTap={{ scale: 0.95 }}
						className="transition-transform duration-200"
					>
						<Link
							href={`/recipe/${recipe.recipe_id}`}
							className="bg-gradient-to-r from-primary to-primary-hover text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
						>
							<FontAwesomeIcon icon={faUtensils} className="w-4 h-4" />
							Cook This Recipe
						</Link>
					</motion.div>
				</div>
			</div>
		</motion.article>
	);
};

export default memo(PostBlock);