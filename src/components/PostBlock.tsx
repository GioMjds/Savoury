'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faClock,
	faUsers,
	faUtensils,
	faHeart,
	faComment,
	faShare,
	faStar,
	faBookmark as faBookmarkSolid
} from '@fortawesome/free-solid-svg-icons';
import {
	faBookmark as faBookmarkRegular
} from '@fortawesome/free-regular-svg-icons';
import { formatCategory, formatTime } from '@/utils/formaters';
import { PostBlockProps } from '@/types/RecipeResponse';
import { useBookmark } from '@/hooks/useBookmark';

const PostBlock = ({ recipe }: PostBlockProps) => {
	const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
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
		<article className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-2">
			{/* Recipe Image with Overlay Info */}
			<Link
				href={`/recipe/${recipe.recipe_id}`}
				className="block relative"
			>
				<div className="relative h-80 bg-gradient-to-br from-accent to-muted overflow-hidden">
					<Image
						src={recipe.image_url as string}
						alt={recipe.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
						loading="lazy"
					/>
					{/* Elegant gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
					{/* Top Row: Category & Bookmark */}
					<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
						{recipe.category && (
							<span className="bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/20 transform translate-y-0 opacity-100 transition-all duration-300">
								{formatCategory(recipe.category)}
							</span>
						)}

						<button 
							onClick={handleBookmarkClick}
							disabled={bookmarkLoading}
							className={`bg-white/20 backdrop-blur-sm p-2 rounded-full transition-all duration-200 shadow-lg hover:bg-white/30 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed ${isBookmarked ? 'text-yellow-400 bg-yellow-400/20' : 'text-white'}`}
							title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
						>
							<FontAwesomeIcon
								icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular}
								className={`w-4 h-4 transition-colors duration-200 ${bookmarkLoading ? 'animate-pulse' : ''}`}
							/>
						</button>
					</div>

					{/* Bottom Row: Quick Stats */}
					<div className="absolute bottom-4 left-4 right-4">
						<div className="flex items-center justify-between">
							{/* Quick Stats Pills */}
							<div className="flex items-center gap-2 flex-wrap">
								{totalTime > 0 && (
									<div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
										<FontAwesomeIcon
											icon={faClock}
											className="w-3 h-3"
										/>
										{formatTime(totalTime)}
									</div>
								)}
								{recipe.servings && (
									<div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
										<FontAwesomeIcon
											icon={faUsers}
											className="w-3 h-3"
										/>
										{recipe.servings}
									</div>
								)}
							</div>

							{/* Rating */}
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

			{/* Content Section */}
			<div className="p-6">
				{/* User Info - Compact */}
				<div className="flex items-center gap-3 mb-4">
					<Link
						href={`/profile/${recipe.user.user_id}`}
						className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
					>
						<Image
							src={recipe.user.profile_image}
							alt={`${recipe.user.fullname}'s profile`}
							fill
							priority
							className="object-cover"
						/>
					</Link>
					<div className="flex-1">
						<Link
							href={`/profile/${recipe.user.user_id}`}
							className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
						>
							{recipe.user.fullname}
						</Link>
						<div className="flex items-center gap-2 text-xs text-muted">
							<span>@{recipe.user.username}</span>
							<span>•</span>
							<span>
								{new Date(recipe.created_at).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>

				{/* Recipe Title & Description */}
				<div className="mb-6">
					<Link href={`/recipe/${recipe.recipe_id}`}>
						<h2 className="text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors line-clamp-2 leading-tight">
							{recipe.title}
						</h2>
					</Link>
					{recipe.description && (
						<p className="text-muted line-clamp-2 text-sm leading-relaxed">
							{recipe.description}
						</p>
					)}
				</div>

				{/* Enhanced Cooking Info */}
				<div className="bg-muted/50 rounded-xl p-4 mb-6">
					<div className="grid grid-cols-3 gap-4">
						{recipe.prep_time_minutes && (
							<div className="text-center">
								<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
									<FontAwesomeIcon
										icon={faClock}
										className="w-3 h-3 text-primary"
									/>
								</div>
								<p className="text-xs text-muted mb-1">
									Prep Time
								</p>
								<p className="font-semibold text-foreground text-sm">
									{formatTime(recipe.prep_time_minutes)}
								</p>
							</div>
						)}
						{recipe.cook_time_minutes && (
							<div className="text-center">
								<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
									<FontAwesomeIcon
										icon={faUtensils}
										className="w-3 h-3 text-primary"
									/>
								</div>
								<p className="text-xs text-muted mb-1">
									Cook Time
								</p>
								<p className="font-semibold text-foreground text-sm">
									{formatTime(recipe.cook_time_minutes)}
								</p>
							</div>
						)}
						{recipe.servings && (
							<div className="text-center">
								<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
									<FontAwesomeIcon
										icon={faUsers}
										className="w-3 h-3 text-primary"
									/>
								</div>
								<p className="text-xs text-muted mb-1">
									Servings
								</p>
								<p className="font-semibold text-foreground text-sm">
									{recipe.servings}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Featured Ingredients */}
				{recipe.recipeIngredients.length > 0 && (
					<div className="mb-6">
						<h4 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
							<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
							Key Ingredients ({recipe.recipeIngredients.length})
						</h4>
						<div className="flex flex-wrap gap-2">
							{recipe.recipeIngredients
								.slice(0, 4)
								.map((recipeIngredient, index) => (
									<div
										key={index}
										className="bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-medium text-primary opacity-100 scale-100 transition-all duration-200 hover:scale-105"
									>
										{recipeIngredient.ingredient.ingredient_name}
									</div>
								))}
							{recipe.recipeIngredients.length > 4 && (
								<div className="bg-muted border border-border px-3 py-1.5 rounded-full text-xs font-medium text-foreground">
									+{recipe.recipeIngredients.length - 4} more
								</div>
							)}
						</div>
					</div>
				)}

				{/* Action Bar */}
				<div className="flex items-center justify-between pt-4 border-t border-border">
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

					<div className="hover:scale-105 transition-transform duration-200">
						<Link
							href={`/recipe/${recipe.recipe_id}`}
							className="bg-gradient-to-r from-primary to-primary-hover text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
						>
							Cook This Recipe
						</Link>
					</div>
				</div>
			</div>
		</article>
	);
};

export default memo(PostBlock);