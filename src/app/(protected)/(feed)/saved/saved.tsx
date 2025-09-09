'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { SavedResponse } from '@/types/RecipeResponse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUsers, faCalendar, faFilter } from '@fortawesome/free-solid-svg-icons';
import { formatCategory } from '@/utils/formaters';
import { user } from '@/services/User';

export default function SavedPage({ userId }: { userId: number }) {
    const [filter, setFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');

    const { data } = useQuery<SavedResponse>({
        queryKey: ['saved', userId],
        queryFn: () => user.getSavedRecipePosts(userId),
    });

    const filteredBookmarks = data?.bookmark.filter((bookmark) => {
        if (filter === 'all') return true;
        return (
            bookmark.recipe.category?.toLowerCase() === filter.toLowerCase()
        );
    });

    const sortedBookmarks = filteredBookmarks?.sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
    });

    const categories = Array.from(
        new Set(
            data?.bookmark.map((bookmark) => bookmark.recipe.category).filter(Boolean) || []
        )
    );

    return (
        <div className="min-h-screen bg-muted py-8 pt-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                        Your Saved Recipes
                    </h1>
                    <p className="text-muted">
                        Your collection of {data?.bookmark.length ?? 0} delicious recipes to try
                    </p>
                </motion.div>

                {/* Filter and Sort Controls */}
                {(categories.length > 0 || (data?.bookmark?.length ?? 0) > 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6 mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faFilter} className="text-muted" />
                                <span className="text-sm font-medium text-foreground">Filter by:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        filter === 'all'
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-accent text-foreground hover:bg-primary-light hover:text-white'
                                    }`}
                                >
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setFilter(formatCategory(category))}
                                        className={`px-4 py-2 cursor-pointer capitalize rounded-full text-sm font-medium transition-colors ${
                                            filter === category
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-accent text-foreground hover:bg-primary-light hover:text-white'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-accent border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {!sortedBookmarks || sortedBookmarks.length === 0 ? (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-16 bg-white rounded-xl shadow-sm"
                        >
                            <div className="text-6xl mb-6">📚</div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {(data?.bookmark?.length ?? 0) === 0
                                    ? 'No Saved Recipes Yet'
                                    : 'No Recipes Match Your Filter'}
                            </h3>
                            <p className="text-muted mb-6 max-w-md mx-auto">
                                {(data?.bookmark?.length ?? 0) === 0
                                    ? 'Start saving recipes you love to find them easily here later.'
                                    : 'Try selecting a different category to see more recipes.'}
                            </p>
                            {(data?.bookmark?.length ?? 0) === 0 && (
                                <Link
                                    href="/recipes"
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                                >
                                    Explore Recipes
                                </Link>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="recipe-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {sortedBookmarks.map((bookmark, index) => (
                                    <motion.div
                                        key={bookmark.bookmark_id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <Link
                                            href={`/recipes/${bookmark.recipe.recipe_id}`}
                                            className="block"
                                        >
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <Image
                                                    src={bookmark.recipe.image_url}
                                                    alt={bookmark.recipe.title}
                                                    fill
                                                    loading="lazy"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {bookmark.recipe.category && (
                                                    <div className="absolute capitalize top-3 right-3 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                                                        {bookmark.recipe.category}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                    {bookmark.recipe.title}
                                                </h3>
                                                <p className="text-muted text-sm mb-4 line-clamp-2">
                                                    {bookmark.recipe.description}
                                                </p>
                                                <div className="flex items-center text-sm text-muted mb-4">
                                                    <span className="truncate">
                                                        By @{bookmark.user?.username}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-muted">
                                                    <div className="flex items-center gap-1">
                                                        <FontAwesomeIcon icon={faClock} />
                                                        <span>
                                                            {(bookmark.recipe.prep_time_value || 0) +
                                                                (bookmark.recipe.cook_time_value || 0)}{' '}
                                                            {bookmark.recipe.prep_time_unit || 'mins'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FontAwesomeIcon icon={faUsers} />
                                                        <span>
                                                            {bookmark.recipe.servings} servings
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="px-5 pb-4 pt-2 border-t border-border">
                                            <div className="flex items-center gap-1 text-xs text-muted">
                                                <FontAwesomeIcon icon={faCalendar} />
                                                <span>
                                                    Saved on{' '}
                                                    {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}