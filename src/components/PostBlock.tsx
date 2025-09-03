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
	faBookmark as faBookmarkSolid,
	faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { 
	faBookmark as faBookmarkRegular, 
	faHeart as faHeartRegular 
} from '@fortawesome/free-regular-svg-icons';
import { formatCategory, formatTime } from '@/utils/formaters';
import { PostBlockProps } from '@/types/RecipeResponse';
import { useBookmark } from '@/hooks/useBookmark';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeAction } from '@/services/Recipe';

const PostBlock = ({ recipe, currentUserId }: PostBlockProps) => {
	const queryClient = useQueryClient();

	const isLikedByCurrentUser = currentUserId 
		? recipe.userLikes?.some(like => like.user_id === currentUserId) || recipe.isLiked
		: false;

	const likeRecipe = useMutation({
		mutationFn: async (recipeId: number) => {
			return await recipeAction.likeRecipePost(recipeId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['feed'] });
		},
		onError: (error) => {
			console.error(`Error liking the recipe: ${error}`);
		}
	});

	const unlikeRecipe = useMutation({
		mutationFn: async (recipeId: number) => {
			return await recipeAction.unlikeRecipePost(recipeId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['feed'] });
		},
		onError: (error) => {
			console.error(`Error unliking the recipe: ${error}`);
		}
	});

	const {
		isBookmarked,
		isLoading: bookmarkLoading,
		toggleBookmark,
	} = useBookmark(recipe.isBookmarked);

	const handleBookmarkClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		await toggleBookmark(recipe.recipe_id);
	};

	const handleLikeClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (isLikedByCurrentUser) {
			unlikeRecipe.mutate(recipe.recipe_id);
		} else {
			likeRecipe.mutate(recipe.recipe_id);
		}
	}

	const commentsCount = recipe.comments.length;
	const isLikeLoading = likeRecipe.isPending || unlikeRecipe.isPending;

	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className="bg-white rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-lg"
		>
			{/* Header */}
			<div className="p-5 border-b border-border flex items-center justify-between">
				<Link
					href={`/profile/${recipe.user.user_id}`}
					className="flex items-center gap-3"
				>
					<div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
						<Image
							src={recipe.user.profile_image}
							alt={`${recipe.user.fullname}'s profile`}
							width={48}
							height={48}
							loading="lazy"
							className="object-cover"
						/>
					</div>
					<div>
						<p className="text-md font-semibold text-foreground">
							{recipe.user.fullname}
						</p>
						<p className="text-sm text-muted">
							@{recipe.user.username} •{' '}
							{new Date(recipe.created_at).toLocaleDateString()}
						</p>
					</div>
				</Link>

				<div className="flex items-center gap-2">
					<button
						onClick={handleBookmarkClick}
						disabled={bookmarkLoading}
						className={`p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed ${
							isBookmarked ? 'text-yellow-400' : 'text-muted hover:text-primary'}`}
						title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
					>
						<FontAwesomeIcon
							icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular}
							className={`transition-colors duration-200 ${
								bookmarkLoading ? 'animate-pulse' : ''}`}
						/>
					</button>
					<button className="p-2 text-muted hover:text-foreground rounded-full transition-colors">
						<FontAwesomeIcon icon={faEllipsisH} />
					</button>
				</div>
			</div>

			{/* Recipe Image */}
			<Link
				href={`/recipe/${recipe.recipe_id}`}
				className="block relative"
			>
				<div className="relative h-80 bg-gradient-to-br from-accent via-muted to-primary-lighter overflow-hidden">
					<Image
						src={recipe.image_url as string}
						alt={recipe.title}
						fill
						loading="lazy"
						className="object-cover"
					/>

					{/* Category & Stats Overlay */}
					<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
						{recipe.category && (
							<div className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-sm font-semibold shadow-md border border-white/20">
								{formatCategory(recipe.category)}
							</div>
						)}
					</div>
				</div>
			</Link>

			{/* Content */}
			<div className="p-5">
				{/* Title and Description */}
				<div className="mb-4">
					<Link href={`/recipe/${recipe.recipe_id}`}>
						<h2 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors line-clamp-1">
							{recipe.title}
						</h2>
					</Link>
					{recipe.description && (
						<p className="text-md text-muted leading-relaxed line-clamp-2">
							{recipe.description}
						</p>
					)}
				</div>

				{/* Recipe Stats */}
				<div className="grid grid-cols-3 gap-3 mb-4">
					{recipe.prep_time_minutes && (
						<div className="text-center p-3 bg-muted/30 rounded-lg">
							<FontAwesomeIcon
								icon={faClock}
								className="w-5 h-5 text-primary mb-2 mx-auto"
							/>
							<p className="text-sm text-muted mb-1">Preparation Time</p>
							<p className="text-md font-semibold text-foreground">
								{formatTime(recipe.prep_time_minutes)}
							</p>
						</div>
					)}
					{recipe.cook_time_minutes && (
						<div className="text-center p-3 bg-muted/30 rounded-lg">
							<FontAwesomeIcon
								icon={faUtensils}
								className="w-5 h-5 text-primary mb-2 mx-auto"
							/>
							<p className="text-sm text-muted mb-1">Cook Time</p>
							<p className="text-md font-semibold text-foreground">
								{formatTime(recipe.cook_time_minutes)}
							</p>
						</div>
					)}
					{recipe.servings && (
						<div className="text-center p-3 bg-muted/30 rounded-lg">
							<FontAwesomeIcon
								icon={faUsers}
								className="w-5 h-5 text-primary mb-2 mx-auto"
							/>
							<p className="text-sm text-muted mb-1">Servings</p>
							<p className="text-md font-semibold text-foreground">
								{recipe.servings}
							</p>
						</div>
					)}
				</div>

				{/* Ingredients Preview */}
				{recipe.recipeIngredients.length > 0 && (
					<div className="mb-4">
						<p className="text-sm font-medium text-muted mb-2">
							Key Ingredients ({recipe.recipeIngredients.length})
						</p>
						<div className="flex flex-wrap gap-2">
							{recipe.recipeIngredients
								.slice(0, 4)
								.map((recipeIngredient, index) => (
									<span
										key={index}
										className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full"
									>
										{recipeIngredient.ingredient.ingredient_name}
									</span>
								))}
							{recipe.recipeIngredients.length > 4 && (
								<span className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full">
									+{recipe.recipeIngredients.length - 4} more
								</span>
							)}
						</div>
					</div>
				)}

				{/* Action Bar */}
				<div className="flex items-center justify-between pt-4 border-t border-border">
					<div className="flex items-center gap-5">
						<button 
                            onClick={handleLikeClick}
                            disabled={isLikeLoading || !currentUserId}
                            className={`flex cursor-pointer items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${
                                isLikedByCurrentUser ? 'text-red-500' : 'text-muted hover:text-red-500'}`}
                        >
                            <FontAwesomeIcon
                                icon={isLikedByCurrentUser ? faHeart : faHeartRegular}
                                className="w-5 h-5 transition-all duration-200"
                            />
                            <span className="text-md font-medium">
                                {recipe.likes > 0 ? recipe.likes : 'Like'}
                            </span>
                        </button>

						<Link
							href={`/recipe/${recipe.recipe_id}#comments`}
							className="flex items-center gap-2 text-muted hover:text-primary transition-colors duration-200"
						>
							<FontAwesomeIcon
								icon={faComment}
								className="w-5 h-5"
							/>
							<span className="text-md font-medium">
								{commentsCount}
							</span>
						</Link>

						<button className="flex items-center gap-2 text-muted hover:text-primary transition-colors duration-200">
							<FontAwesomeIcon
								icon={faShare}
								className="w-5 h-5"
							/>
							<span className="text-md font-medium">Share</span>
						</button>
					</div>
				</div>
			</div>
		</motion.article>
	);
};

export default memo(PostBlock);
