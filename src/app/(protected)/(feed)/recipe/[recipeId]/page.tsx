import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import GetRecipePost from "./get-recipe-post";
import { recipe } from "@/services/Recipe";
import { notFound } from "next/navigation";

export default async function RecipePostId({ params }: { params: Promise<{ recipeId: number }> }) {
    const { recipeId } = await params;
    const queryClient = new QueryClient();

    try {
        const data = await queryClient.fetchQuery({
            queryKey: ['recipeId', recipeId],
            queryFn: () => recipe.getRecipe(recipeId)
        });
        if (!data) return notFound();
    } catch (error) {
        return notFound();
    }
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GetRecipePost recipeId={recipeId} />
        </HydrationBoundary>
    );
}