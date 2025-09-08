'use client';

import { useState } from 'react';
import { recipeAction } from '@/services/Recipe';

export const useBookmark = (initialBookmarkState: boolean = false, currentUserId: number) => {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarkState);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleBookmark = async (recipeId: number) => {
        if (isLoading) return;

        setIsLoading(true);
        setIsBookmarked(!isBookmarked);

        try {
            await recipeAction.toggleBookmark(recipeId, currentUserId);
            const updatedRecipeResponse = await recipeAction.getRecipe(recipeId, currentUserId);
            const updatedRecipe = updatedRecipeResponse.data || updatedRecipeResponse.recipe || updatedRecipeResponse;
            setIsBookmarked(updatedRecipe.isBookmarked);
        } catch (error: any) {
            console.log(`Error toggling bookmark: ${error}`);
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