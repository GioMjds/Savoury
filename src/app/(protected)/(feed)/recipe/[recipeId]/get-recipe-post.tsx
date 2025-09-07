'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { recipeAction } from '@/services/Recipe';
import { formatDate, formatTime, formatCategory } from '@/utils/formaters';
import StatCard from '@/components/StatCard';
import TabButton from '@/components/TabButton';
import { Comment, Recipe, RecipeApiResponse, RecipePostProps, TabType } from '@/types/RecipeResponse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faBookmark, faClock, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons';

export default function GetRecipePost({ recipeId, currentUserId }: RecipePostProps) {
    const [activeTab, setActiveTab] = useState<TabType>('ingredients');

    const { data } = useQuery<RecipeApiResponse>({
        queryKey: ['recipeId', recipeId],
        queryFn: () => recipeAction.getRecipe(recipeId),
        refetchOnWindowFocus: false,
    });

    if (!data) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse text-xl text-muted">Loading recipe...</div>
        </div>
    );

    const recipeData: Recipe = data.recipe;

    const isCommentLikedByUser = (comment: Comment) => {
        if (!currentUserId || !comment.likes) return false;
        if (comment.likes.length > 0) {
            return comment.likes.some((like) => like.user_id === currentUserId);
        }
        return false;
    };

    const getCommentLikeCount = (comment: Comment): number => {
        return comment._count?.likes ?? comment.likes?.length ?? comment.comment_likes ?? 0;
    };

    const getCommentReplyCount = (comment: Comment): number => {
        return comment._count?.replies ?? comment.replies?.length ?? 0;
    };

    const isRecipeLikedByUser = (): boolean => {
        if (!currentUserId) return false;
        return recipeData.userLikes?.some(like => like.user_id === currentUserId) ?? false;
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto pt-20 px-2 py-4">
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
                                <div className="md:w-1/2 relative h-72 md:h-auto">
                                    {recipeData.image_url ? (
                                        <Image
                                            src={recipeData.image_url}
                                            alt={recipeData.title}
                                            fill
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary-lighter flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUtensils} className="w-16 h-16 text-primary" />
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    {recipeData.category && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="absolute top-4 left-4"
                                        >
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-primary shadow-md capitalize">
                                                {formatCategory(recipeData.category)}
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Recipe Info */}
                                <div className="md:w-1/2 p-6 flex flex-col">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight"
                                    >
                                        {recipeData.title}
                                    </motion.h1>

                                    {/* Author Info */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center gap-3 mb-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                            <Image
                                                src={recipeData.user.profile_image || '/default-avatar.png'}
                                                alt={recipeData.user.fullname}
                                                width={48}
                                                height={48}
                                                priority
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate">
                                                {recipeData.user.fullname}
                                            </p>
                                            <p className="text-sm text-muted truncate">
                                                @{recipeData.user.username}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted whitespace-nowrap">
                                            {formatDate(recipeData.created_at)}
                                        </div>
                                    </motion.div>

                                    {/* Description */}
                                    {recipeData.description && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-muted leading-relaxed mb-6 line-clamp-3"
                                        >
                                            {recipeData.description}
                                        </motion.p>
                                    )}

                                    {/* Recipe Stats */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="grid grid-cols-2 gap-3 mb-6"
                                    >
                                        <StatCard
                                            icon={faClock}
                                            label="Prep Time"
                                            value={recipeData.prep_time_minutes ? formatTime(Number(recipeData.prep_time_minutes)) : 'N/A'}
                                        />
                                        <StatCard
                                            icon={faClock}
                                            label="Cook Time"
                                            value={recipeData.cook_time_minutes ? formatTime(Number(recipeData.cook_time_minutes)) : 'N/A'}
                                        />
                                        <StatCard
                                            icon={faUsers}
                                            label="Servings"
                                            value={recipeData.servings ? `${recipeData.servings} people` : 'N/A'}
                                        />
                                        <StatCard
                                            icon={faComment}
                                            label="Comments"
                                            value={`${recipeData.comments.length}`}
                                        />
                                    </motion.div>

                                    {/* Recipe Actions */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center gap-3 mt-auto"
                                    >
                                        <button
                                            type="button"
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center ${
                                                isRecipeLikedByUser()
                                                    ? 'bg-error-light text-error hover:bg-error-light/80'
                                                    : 'bg-muted text-foreground hover:bg-accent'
                                            }`}
                                        >
                                            <FontAwesomeIcon 
                                                icon={faHeart} 
                                                className={`w-4 h-4 ${isRecipeLikedByUser() ? 'text-error' : ''}`}
                                            />
                                            <span>{recipeData.likes} Likes</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-muted text-foreground hover:bg-accent transition-colors flex-1 justify-center"
                                        >
                                            <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Ingredients & Instructions Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
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
                                            <h3 className="text-xl font-semibold text-foreground mb-4">Ingredients</h3>
                                            {recipeData.recipeIngredients.map((ingredient, index) => (
                                                <motion.div
                                                    key={`ingredient-${index}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent transition-colors border-l-4 border-primary"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                                    <span className="font-medium text-primary min-w-[80px] text-sm">
                                                        {ingredient.quantity}{' '}
                                                        {ingredient.unit}
                                                    </span>
                                                    <span className="text-foreground capitalize">
                                                        {ingredient.ingredient.ingredient_name}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="instructions"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-xl font-semibold text-foreground mb-4">Instructions</h3>
                                            {recipeData.instructions.map(
                                                (instruction, index) => (
                                                    <motion.div
                                                        key={`instruction-${index}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex gap-4 p-4 rounded-lg bg-muted border-l-4 border-primary"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-md">
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
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                            <div className="p-4 border-b border-border bg-muted">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <FontAwesomeIcon icon={faComment} className="w-5 h-5 text-primary" />
                                    Comments ({recipeData.comments.length})
                                </h3>
                                <p className="text-sm text-muted mt-1">Join the conversation</p>
                            </div>
                            <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto">
                                {recipeData.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {recipeData.comments.map((comment: Comment, index: number) => (
                                            <motion.div
                                                key={comment.comment_id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8 + index * 0.1 }}
                                                className="p-4 rounded-lg bg-muted border border-border"
                                            >
                                                {/* Comment Header - User Info */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white shadow-sm">
                                                        <Image
                                                            src={comment.user.profile_image || '/default-avatar.png'}
                                                            alt={comment.user.fullname}
                                                            width={32}
                                                            height={32}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">
                                                            {comment.user.fullname}
                                                        </p>
                                                        <p className="text-xs text-muted">
                                                            @{comment.user.username}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-muted flex-shrink-0">
                                                        {formatDate(comment.created_at)}
                                                    </span>
                                                </div>

                                                {/* Comment Text */}
                                                <p className="text-foreground text-sm leading-relaxed mb-3">
                                                    {comment.comment_text}
                                                </p>

                                                {/* Comment Actions */}
                                                <div className="flex items-center gap-4 text-xs text-muted">
                                                    <button 
                                                        type="button"
                                                        className={`flex items-center gap-1 transition-colors ${isCommentLikedByUser(comment) 
                                                            ? 'text-error' 
                                                            : 'hover:text-primary'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={faHeart} 
                                                            className="w-3 h-3"
                                                        />
                                                        <span>{getCommentLikeCount(comment)}</span>
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={faComment}
                                                            className="w-3 h-3"
                                                        />
                                                        <span>Reply</span>
                                                    </button>
                                                    {getCommentReplyCount(comment) > 0 && (
                                                        <span className="text-muted ml-auto">
                                                            {getCommentReplyCount(comment)} {getCommentReplyCount(comment) === 1 ? 'reply' : 'replies'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Replies Section */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="mt-3 ml-4 space-y-3 border-l-2 border-primary/20 pl-3">
                                                        {comment.replies.map((reply: Comment, replyIndex: number) => (
                                                            <motion.div
                                                                key={reply.comment_id}
                                                                initial={{ opacity: 0, x: 10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.9 + replyIndex * 0.05 }}
                                                                className="p-3 rounded bg-background border border-border"
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-white">
                                                                        <Image
                                                                            src={reply.user.profile_image || '/default-avatar.png'}
                                                                            alt={reply.user.fullname}
                                                                            width={24}
                                                                            height={24}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs font-medium text-foreground">
                                                                        {reply.user.fullname}
                                                                    </span>
                                                                    <span className="text-xs text-muted ml-auto">
                                                                        {formatDate(reply.created_at)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-foreground leading-relaxed">
                                                                    {reply.comment_text}
                                                                </p>
                                                                {getCommentLikeCount(reply) > 0 && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <FontAwesomeIcon 
                                                                            icon={faHeart}
                                                                            className={`text-xs ${
                                                                                isCommentLikedByUser(reply) 
                                                                                    ? 'text-error' 
                                                                                    : 'text-muted'
                                                                            }`}
                                                                        />
                                                                        <span className="text-xs text-muted">
                                                                            {getCommentLikeCount(reply)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="text-4xl mb-3 text-primary-light">💬</div>
                                        <p className="text-muted text-sm font-medium">
                                            No comments yet
                                        </p>
                                        <p className="text-muted text-xs mt-1">
                                            Be the first to share your thoughts!
                                        </p>
                                        <button className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors">
                                            Add a comment
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}