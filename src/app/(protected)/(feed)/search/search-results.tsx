'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { feed } from '@/services/Feed';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.trim() || '';
    const [searchQuery, setSearchQuery] = useState(query);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['search', query],
        queryFn: () => feed.searchRecipePost(query),
        enabled: !!query,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    return (
        <section className="container mx-auto px-4 py-8 mt-16">
            {/* Search Header */}
            <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-4 text-primary">
                    Search Results
                </h1>
                
                <div className="max-w-2xl">
                    <SearchBar 
                        className="w-full"
                    />
                </div>
                
                {query && (
                    <p className="text-muted mt-4">
                        {data?.results?.length > 0 
                            ? `Found ${data.results.length} results for "${query}"`
                            : `No results found for "${query}"`
                        }
                    </p>
                )}
            </motion.div>

            {/* Loading State */}
            {isLoading && (
                <motion.div 
                    className="flex justify-center items-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </motion.div>
            )}

            {/* Error State */}
            {isError && (
                <motion.div 
                    className="bg-error-light text-error p-6 rounded-xl text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
                    <p>Please try your search again.</p>
                </motion.div>
            )}

            {/* Results Grid */}
            <AnimatePresence mode="wait">
                {data?.results?.length > 0 ? (
                    <motion.div
                        key="results-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {data.results.map((recipe: any, index: number) => (
                            <motion.div
                                key={recipe.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                }}
                                className="bg-white rounded-xl border border-border overflow-hidden shadow-md transition-all cursor-pointer"
                                onClick={() => window.location.href = `/recipe/${recipe.id}`}
                            >
                                {recipe.image_url && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={recipe.image_url}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {recipe.category}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="p-5">
                                    <h2 className="text-xl font-semibold text-primary line-clamp-1 mb-2">
                                        {recipe.title}
                                    </h2>
                                    <p className="text-muted line-clamp-2 mb-4">
                                        {recipe.description}
                                    </p>
                                    
                                    <div className="flex justify-between items-center text-sm text-muted">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} min</span>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>{recipe.servings} servings</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : query && !isLoading && (
                    <motion.div
                        key="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="col-span-full text-center py-12"
                    >
                        <div className="max-w-md mx-auto">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No recipes found</h3>
                            <p className="text-muted mb-4">
                                We couldn't find any recipes matching "{query}". Try different keywords or browse our categories.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}