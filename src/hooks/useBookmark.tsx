'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { recipe } from '@/services/Recipe';

export const useBookmark = (initialBookmarkState: boolean = false) => {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarkState);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleBookmark = async (recipeId: number) => {
        if (isLoading) return;

        setIsLoading(true);
        const previousState = isBookmarked;

        setIsBookmarked(!isBookmarked);

        try {
            await recipe.toggleBookmark(recipeId);

            const updatedRecipeResponse = await recipe.getRecipe(recipeId);
            const updatedRecipe = updatedRecipeResponse.recipe;
            
            setIsBookmarked(updatedRecipe.isBookmarked || false);

            toast.success(updatedRecipe.isBookmarked ? 'Recipe bookmarked!' : 'Bookmark removed!',
                {
                    position: "bottom-right",
                    autoClose: 3000,
                }
            );
        } catch (error: any) {
            setIsBookmarked(previousState);

            const errorMessage = error?.message || 'Failed to update bookmark. Please try again.';
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 3000,
            });
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
