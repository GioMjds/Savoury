import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import GetRecipePost from "./get-recipe-post";
import { recipeAction } from "@/services/Recipe";
import { notFound } from "next/navigation";

export async function generateMetadata(
    { params }: { params: Promise<{ recipeId: number }> }
): Promise<Metadata> {
    const { recipeId } = await params;

    try {
        const data = await recipeAction.getRecipe(recipeId);

        if (!data) {
            return {
                title: 'Recipe Not Found',
                description: 'The requested recipe could not be found.',
            }
        }

        return {
            title: `${data.recipe.title} by @${data.recipe.user.username}`,
            description: `Check out @${data.recipe.user.username}'s recipe for ${data.recipe.title} on Savoury!`,
        }
    } catch {
        return {
            title: 'Error fetching recipe',
            description: 'There was an error fetching the recipe details.',
        }
    }
}

export default async function RecipePostId({ params }: { params: Promise<{ recipeId: number }> }) {
    const { recipeId } = await params;
    const queryClient = new QueryClient();

    try {
        const data = await queryClient.fetchQuery({
            queryKey: ['recipeId', recipeId],
            queryFn: () => recipeAction.getRecipe(recipeId)
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