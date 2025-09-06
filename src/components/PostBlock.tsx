'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
	faChevronUp,
	faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {
	faBookmark as faBookmarkRegular,
	faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons';
import { formatCategory, formatTime, formatTimeAgo } from '@/utils/formaters';
import { PostBlockProps } from '@/types/RecipeResponse';
import { useBookmark } from '@/hooks/useBookmark';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeAction } from '@/services/Recipe';

interface Comment {
    comment_id: number;
    comment_text: string;
    created_at?: string;
    user?: {
        user_id: number;
        username: string;
        fullname: string;
        profile_image: string;
    };
}

const PostBlock = ({ recipe, currentUserId, currentUser }: PostBlockProps) => {
	const [likeCount, setLikeCount] = useState<number>(recipe.likes);
	const [userLikes, setUserLikes] = useState(recipe.userLikes || []);
	const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
	const [showComments, setShowComments] = useState<boolean>(false);
	const [commentText, setCommentText] = useState<string>('');

	const queryClient = useQueryClient();

	const isLikedByCurrentUser = currentUserId
		? userLikes?.some((like) => like.user_id === currentUserId)
		: false;

	useEffect(() => {
		setLikeCount(recipe.likes);
		setUserLikes(recipe.userLikes || []);
	}, [recipe.userLikes, recipe.recipe_id]);

	// Like / unlike mutations
	const likeRecipe = useMutation({
		mutationFn: async (recipeId: number) => {
			return await recipeAction.likeRecipePost(recipeId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['feed'] });
		},
		onError: (error) => {
			console.error(`Error liking the recipe: ${error}`);
		},
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
		},
	});

	// Comment mutations
	const postComment = useMutation({
		mutationFn: async (commentData: { comment: string }) => {
			return await recipeAction.postComment(
				recipe.recipe_id,
				commentData
			);
		},
		onSuccess: () => {
			setCommentText('');
			setShowCommentForm(false);
			queryClient.invalidateQueries({ queryKey: ['feed'] });
			queryClient.invalidateQueries({
				queryKey: ['recipe', recipe.recipe_id],
			});
		},
		onError: (error) => {
			console.error(`Error posting comment: ${error}`);
		},
	});

	const {
		isBookmarked,
		isLoading: bookmarkLoading,
		toggleBookmark,
	} = useBookmark(recipe.isBookmarked ?? false);

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
	};

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!commentText) return;
		postComment.mutate({ comment: commentText });
	};

	const handleCommentClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowComments(!showComments);
		setShowCommentForm(!showCommentForm);
	};
	
	const handleToggleCommentForm = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowCommentForm(!showComments);
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
                            priority
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
                            isBookmarked
                                ? 'text-yellow-400'
                                : 'text-muted hover:text-primary'
                        }`}
                        title={
                            isBookmarked
                                ? 'Remove from bookmarks'
                                : 'Add to bookmarks'
                        }
                    >
                        <FontAwesomeIcon
                            icon={
                                isBookmarked
                                    ? faBookmarkSolid
                                    : faBookmarkRegular
                            }
                            className={`transition-colors duration-200 ${
                                bookmarkLoading ? 'animate-pulse' : ''
                            }`}
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
                        src={recipe.image_url || '/savoury-logo.png'}
                        alt={recipe.title}
                        fill
                        priority
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
                            <p className="text-sm text-muted mb-1">
                                Preparation Time
                            </p>
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
										{recipeIngredient.quantity} {recipeIngredient.unit} {""}
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
                                isLikedByCurrentUser
                                    ? 'text-red-500'
                                    : 'text-muted hover:text-red-500'
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={
                                    isLikedByCurrentUser
                                        ? faHeart
                                        : faHeartRegular
                                }
                                className={`w-5 h-5 transition-all duration-200 ${
                                    isLikeLoading ? 'animate-pulse' : ''
                                }`}
                            />
                            <span className="text-md font-medium">
                                {likeCount > 0 ? likeCount : 'Like'}
                            </span>
                        </button>
                        
                        <button
                            onClick={handleCommentClick}
                            className="flex items-center gap-2 cursor-pointer text-muted hover:text-primary transition-colors duration-200"
                        >
                            <FontAwesomeIcon
                                icon={faComment}
                                className="w-5 h-5"
                            />
                            <span className="text-md font-medium">
                                {commentsCount}
                            </span>
                            {commentsCount > 0 && (
                                <FontAwesomeIcon
                                    icon={showComments ? faChevronUp : faChevronDown}
                                    className="w-3 h-3 ml-1"
                                />
                            )}
                        </button>

                        <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors duration-200">
                            <FontAwesomeIcon
                                icon={faShare}
                                className="w-5 h-5"
                            />
                            <span className="text-md font-medium">Share</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 border-t border-border pt-4"
                        >
                            {/* Comment Form Toggle */}
                            {currentUserId && currentUser && (
                                <div className="mb-4">
                                    <button
                                        onClick={handleToggleCommentForm}
                                        className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                                    >
                                        {showCommentForm ? 'Cancel' : 'Write a comment...'}
                                    </button>
                                </div>
                            )}

                            {/* Comment Form */}
                            {showCommentForm && currentUserId && currentUser && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4"
                                >
                                    <form onSubmit={handleCommentSubmit} className="border border-border rounded-lg p-3">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={currentUser.profile_image || '/Default_pfp.jpg'}
                                                    alt={`${currentUser.fullname}'s profile`}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Write a comment..."
                                                    className="w-full px-3 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                                                    rows={3}
                                                />
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-muted">
                                                        {commentText.length}/1000
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowCommentForm(false);
                                                                setCommentText('');
                                                            }}
                                                            className="px-3 py-1 text-xs text-muted hover:text-foreground transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={!commentText.trim() || postComment.isPending}
                                                            className="px-4 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {postComment.isPending ? 'Posting...' : 'Post'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-3">
                                {recipe.comments && recipe.comments.length === 0 ? (
                                    <div className="text-center py-6 text-muted">
                                        <FontAwesomeIcon icon={faComment} className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-sm">No comments yet</p>
                                        <p className="text-xs">Be the first to share your thoughts!</p>
                                    </div>
                                ) : (
                                    recipe.comments?.map((comment: Comment) => (
                                        <motion.div
                                            key={comment.comment_id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                                        >
                                            {comment.user && (
                                                <Link href={`/profile/${comment.user.user_id}`}>
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={comment.user.profile_image || '/Default_pfp.jpg'}
                                                            alt={`${comment.user.fullname}'s profile`}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            )}
                                            <div className="flex-1">
                                                {comment.user && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Link 
                                                            href={`/profile/${comment.user.user_id}`}
                                                            className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                                                        >
                                                            {comment.user.fullname}
                                                        </Link>
                                                        <span className="text-xs text-muted">
                                                            @{comment.user.username}
                                                        </span>
                                                        <span className="text-xs text-muted">
                                                            •
                                                        </span>
                                                        <span className="text-xs text-muted">
                                                            {formatTimeAgo(comment.created_at || "")}
                                                        </span>
                                                    </div>
                                                )}
                                                <p className="text-sm text-foreground leading-relaxed">
                                                    {comment.comment_text}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.article>
	);
};

export default memo(PostBlock);
