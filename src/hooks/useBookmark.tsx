'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { recipe } from '@/services/Recipe';

export const useBookmark = (initialBookmarkState: boolean = false) => {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarkState);
    const [isLoading, setIsLoading] = useState(false);

    const toggleBookmark = async (recipeId: number) => {
        if (isLoading) return;

        setIsLoading(true);
        const previousState = isBookmarked;

        // Optimistic update
        setIsBookmarked(!isBookmarked);

        try {
            const response = await recipe.toggleBookmark(recipeId);
            
            // Update with actual server state
            setIsBookmarked(response.isBookmarked);
            
            toast.success(response.message, {
                position: "bottom-right",
                autoClose: 3000,
            });
        } catch (error: any) {
            // Revert optimistic update on error
            setIsBookmarked(previousState);
            
            const errorMessage = error?.message || 'Failed to update bookmark. Please try again.';
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 3000,
            });
            
            console.error('Bookmark toggle error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isBookmarked,
        isLoading,
        toggleBookmark
    };
};
