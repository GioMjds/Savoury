'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
    faListOl,
    faEdit,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
    faBookmark as faBookmarkRegular,
    faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons';
import { formatCategory, formatTime, formatTimeAgo } from '@/utils/formaters';
import { Comment, PostBlockProps } from '@/types/RecipeResponse';
import { useBookmark } from '@/hooks/useBookmark';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeAction } from '@/services/Recipe';
import Dropdown from './Dropdown';
import Modal from './Modal';

const PostBlock = ({ recipe, currentUserId, currentUser }: PostBlockProps) => {
    const [likeCount, setLikeCount] = useState<number>(recipe.likes);
    const [userLikes, setUserLikes] = useState(recipe.userLikes || []);
    const [commentText, setCommentText] = useState<string>('');
    const [replyText, setReplyText] = useState<string>('');
    const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
    const [showAllInstructions, setShowAllInstructions] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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
            return await recipeAction.likeRecipePost(recipeId, currentUserId!);
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
            return await recipeAction.unlikeRecipePost(recipeId, currentUserId!);
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
            return await recipeAction.postComment(recipe.recipe_id, currentUserId!, commentData);
        },
        onSuccess: () => {
            setCommentText('');
            queryClient.invalidateQueries({ queryKey: ['feed'] });
            queryClient.invalidateQueries({
                queryKey: ['recipe', recipe.recipe_id],
            });
        },
        onError: (error) => {
            console.error(`Error posting comment: ${error}`);
        },
    });

    // Reply mutation
    const postReply = useMutation({
        mutationFn: async (replyData: { comment: string; parentCommentId: number }) => {
            return await recipeAction.replyToComment(recipe.recipe_id, currentUserId!, replyData);
        },
        onSuccess: () => {
            setReplyText('');
            setReplyToCommentId(null);
            queryClient.invalidateQueries({ queryKey: ['feed'] });
            queryClient.invalidateQueries({
                queryKey: ['recipe', recipe.recipe_id],
            });
        },
        onError: (error) => {
            console.error(`Error posting reply: ${error}`);
        },
    });

    // Comment like / unlike mutation
    const likeComment = useMutation({
        mutationFn: async (commentId: number) => {
            return await recipeAction.likeComment(recipe.recipe_id, currentUserId!, commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed'] });
            queryClient.invalidateQueries({
                queryKey: ['recipe', recipe.recipe_id],
            });
        },
        onError: (error) => {
            console.error(`Error liking comment: ${error}`);
        },
    });

    const deleteRecipe = useMutation({
        mutationFn: async (recipeId: number) => {
            return await recipeAction.deleteRecipePost(recipeId, currentUserId!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed'] });
            setShowDeleteModal(false);
        },
        onError: (error) => {
            console.error(`Error deleting the recipe: ${error}`);
        },
    });

    const {
        isBookmarked,
        isLoading: bookmarkLoading,
        toggleBookmark,
    } = useBookmark(recipe.isBookmarked ?? false, currentUserId!);

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
        if (!commentText.trim()) return;
        postComment.mutate({ comment: commentText });
    };

    const handleReplySubmit = (e: React.FormEvent, parentCommentId: number) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        postReply.mutate({ comment: replyText, parentCommentId });
    };

    const handleCommentLike = (e: React.MouseEvent, commentId: number) => {
        e.preventDefault();
        e.stopPropagation();
        likeComment.mutate(commentId);
    };

    const toggleReplyForm = (commentId: number) => {
        setReplyToCommentId(commentId === replyToCommentId ? null : commentId);
    };

    const toggleInstructions = () => {
        setShowAllInstructions(!showAllInstructions);
    };

    const displayedInstructions = showAllInstructions 
        ? recipe.instructions 
        : recipe.instructions.slice(0, 3);

    const commentsCount = recipe.comments.length;
    const isLikeLoading = likeRecipe.isPending || unlikeRecipe.isPending;

    const isOwnRecipe = currentUserId === recipe.user.user_id;

    const dropdownOptions = [
        {
            label: isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks',
            onClick: async () => {
                await toggleBookmark(recipe.recipe_id);
            },
            icon: <FontAwesomeIcon icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular} />,
            disabled: bookmarkLoading,
        },
        {
            label: 'View Recipe',
            href: `/recipe/${recipe.recipe_id}`,
            icon: <FontAwesomeIcon icon={faUtensils} />,
        },
        {
            label: 'View Profile',
            href: `/profile/${recipe.user.user_id}`,
            icon: <FontAwesomeIcon icon={faUsers} />,
        },
        ...(isOwnRecipe ? [
            {
                label: 'Edit Recipe',
                href: `/edit/${recipe.recipe_id}`,
                icon: <FontAwesomeIcon icon={faEdit} />,
            },
            {
                label: 'Delete Recipe',
                onClick: () => setShowDeleteModal(true),
                icon: <FontAwesomeIcon icon={faTrash} />,
                variant: 'danger' as const,
            },
        ] : []),
    ];

    const handleDeleteConfirm = () => {
        deleteRecipe.mutate(recipe.recipe_id);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownClose = () => {
        setIsDropdownOpen(false);
    };

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
                            isBookmarked ? 'text-yellow-400' : 'text-muted hover:text-primary'}`}
                        title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                    >
                        <FontAwesomeIcon
                            icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular}
                            className={`transition-colors duration-200 ${bookmarkLoading ? 'animate-pulse' : ''}`}
                        />
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={handleDropdownToggle}
                            className="p-2 text-muted hover:text-foreground rounded-full transition-colors"
                        >
                            <FontAwesomeIcon icon={faEllipsisH} />
                        </button>
                        <Dropdown
                            options={dropdownOptions}
                            position="bottom"
                            isOpen={isDropdownOpen}
                            onToggle={handleDropdownToggle}
                            onClose={handleDropdownClose}
                        />
                    </div>
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

                {/* Instructions Preview - Enhanced */}
                {recipe.instructions.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-muted flex items-center gap-2">
                                <FontAwesomeIcon icon={faListOl} className="w-4 h-4 text-primary" />
                                Cooking Instructions ({recipe.instructions.length})
                            </p>
                        </div>
                        <div className="space-y-2">
                            {displayedInstructions.map((instruction, index) => (
                                <motion.div
                                    key={instruction.step_number}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/30"
                                >
                                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                                        {instruction.step_number}
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed flex-1">
                                        {instruction.step_text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        {recipe.instructions.length > 3 && (
                            <button
                                onClick={toggleInstructions}
                                className="mt-3 text-sm text-primary hover:text-primary-hover font-medium transition-colors flex items-center gap-1"
                            >
                                {showAllInstructions ? (
                                    <>
                                        <FontAwesomeIcon icon={faChevronUp} className="w-3 h-3" />
                                        Show less
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                                        Show all {recipe.instructions.length} steps
                                    </>
                                )}
                            </button>
                        )}
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
                        
                        <button className="flex items-center gap-2 cursor-pointer text-muted hover:text-primary transition-colors duration-200">
                            <FontAwesomeIcon
                                icon={faComment}
                                className="w-5 h-5"
                            />
                            <span className="text-md font-medium">
                                {commentsCount}
                            </span>
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

                {/* Comments Section - Always Visible */}
                <div className="mt-6 border-t border-border pt-6">
                    {/* Comments List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            Comments ({commentsCount})
                        </h3>
                        
                        {recipe.comments && recipe.comments.length === 0 ? (
                            <div className="text-center py-8 text-muted bg-muted/30 rounded-2xl">
                                <FontAwesomeIcon icon={faComment} className="w-8 h-8 mb-3 opacity-50" />
                                <p className="text-sm font-medium">No comments yet</p>
                                <p className="text-xs mt-1">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            recipe.comments?.map((comment: Comment) => (
                                <motion.div
                                    key={comment.comment_id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    {/* Main Comment */}
                                    <div className="flex gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 hover:bg-muted/20 transition-colors">
                                        {comment.user && (
                                            <Link href={`/profile/${comment.user.user_id}`}>
                                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                                                    <Image
                                                        src={comment.user.profile_image || '/Default_pfp.jpg'}
                                                        alt={`${comment.user.fullname}'s profile`}
                                                        width={40}
                                                        height={40}
                                                        loading="lazy"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </Link>
                                        )}
                                        <div className="flex-1">
                                            {comment.user && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Link 
                                                        href={`/profile/${comment.user.user_id}`}
                                                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                                                    >
                                                        {comment.user.fullname}
                                                    </Link>
                                                    <span className="text-xs text-muted">
                                                        @{comment.user.username}
                                                    </span>
                                                    <span className="text-xs text-muted">•</span>
                                                    <span className="text-xs text-muted">
                                                        {formatTimeAgo(comment.created_at || "")}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-sm text-foreground leading-relaxed mb-3">
                                                {comment.comment_text}
                                            </p>
                                            {/* Comment Actions */}
                                            <div className="flex items-center gap-4 text-xs text-muted">
                                                <button
                                                    onClick={(e) => handleCommentLike(e, comment.comment_id)}
                                                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                                >
                                                    <FontAwesomeIcon 
                                                        icon={faHeart} 
                                                        className={`w-3 h-3 ${comment.likes?.some(like => like.user_id === currentUserId) 
                                                            ? 'text-red-500' 
                                                            : ''
                                                        }`}
                                                    />
                                                    <span>{comment._count?.likes || comment.comment_likes || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => toggleReplyForm(comment.comment_id)}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    Reply
                                                </button>
                                                {comment._count?.replies && comment._count.replies > 0 && (
                                                    <span>{comment._count.replies} replies</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reply Form */}
                                    <AnimatePresence>
                                        {replyToCommentId === comment.comment_id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="ml-11 pl-3 border-l-2 border-border"
                                            >
                                                <form onSubmit={(e) => handleReplySubmit(e, comment.comment_id)} className="flex gap-3 mt-2">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                                                        <Image
                                                            src={currentUser?.profile_image || '/Default_pfp.jpg'}
                                                            alt="Your profile"
                                                            width={32}
                                                            height={32}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            placeholder={`Reply to ${comment.user?.fullname}...`}
                                                            className="w-full p-3 text-sm border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white/80 backdrop-blur-sm"
                                                            rows={2}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
																	setReplyToCommentId(null);
                                                                    setReplyText('');
                                                                }}
                                                                className="px-4 py-2 text-xs text-muted hover:text-foreground transition-colors bg-muted/50 rounded-xl"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={!replyText.trim() || postReply.isPending}
                                                                className="px-4 py-2 text-xs bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                {postReply.isPending ? 'Replying...' : 'Reply'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="ml-11 pl-3 border-l-2 border-border space-y-2">
                                            {comment.replies.map((reply: Comment) => (
                                                <div key={reply.comment_id} className="flex gap-2 p-3 rounded-xl bg-white/30 backdrop-blur-sm hover:bg-muted/10 transition-colors">
                                                    {reply.user && (
                                                        <Link href={`/profile/${reply.user.user_id}`}>
                                                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                                                                <Image
                                                                    src={reply.user.profile_image || '/Default_pfp.jpg'}
                                                                    alt={`${reply.user.fullname}'s profile`}
                                                                    width={32}
                                                                    height={32}
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </Link>
                                                    )}
                                                    <div className="flex-1">
                                                        {reply.user && (
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Link 
                                                                    href={`/profile/${reply.user.user_id}`}
                                                                    className="text-xs font-semibold text-foreground hover:text-primary transition-colors"
                                                                >
                                                                    {reply.user.fullname}
                                                                </Link>
                                                                <span className="text-xs text-muted">
                                                                    @{reply.user.username}
                                                                </span>
                                                                <span className="text-xs text-muted">•</span>
                                                                <span className="text-xs text-muted">
                                                                    {formatTimeAgo(reply.created_at || "")}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-foreground leading-relaxed mb-1">
                                                            {reply.comment_text}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-xs text-muted">
                                                            <button
                                                                onClick={(e) => handleCommentLike(e, reply.comment_id)}
                                                                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                                            >
                                                                <FontAwesomeIcon 
                                                                    icon={faHeart} 
                                                                    className={`w-2 h-2 ${
                                                                        reply.likes?.some(like => like.user_id === currentUserId) 
                                                                            ? 'text-red-500' 
                                                                            : ''
                                                                    }`}
                                                                />
                                                                <span>{reply._count?.likes || reply.comment_likes || 0}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>

					{/* Comment Form */}
                    {currentUserId && currentUser && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 rounded-2xl p-2"
                        >
                            <form onSubmit={handleCommentSubmit} className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                                        <Image
                                            src={currentUser.profile_image || '/Default_pfp.jpg'}
                                            alt={`${currentUser.fullname}'s profile`}
                                            width={40}
                                            height={40}
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Share your thoughts about this recipe..."
                                            className="w-full px-4 py-3 border border-input-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm bg-white/80 backdrop-blur-sm"
                                            rows={3}
                                        />
                                        <div className="flex justify-end items-center mt-2">
                                            <button
                                                type="submit"
                                                disabled={!commentText.trim() || postComment.isPending}
                                                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                            >
                                                {postComment.isPending ? 'Posting...' : 'Post Comment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    title="Delete Recipe"
                    description="Are you sure you want to delete this recipe? This action cannot be undone."
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    cancelText="Cancel"
                    confirmText="Delete"
                    isOpen={showDeleteModal}
                    loading={deleteRecipe.isPending}
                    loadingText="Deleting..."
                />
            )}
        </motion.article>
    );
};

export default memo(PostBlock);