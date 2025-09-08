import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import EditRecipePost from "./edit-recipe-post";
import { recipeAction } from "@/services/Recipe";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ recipeId: number }>;
}): Promise<Metadata> {
    const { recipeId } = await params;
    const currentUser = await getCurrentUser();

    try {
        const data = await recipeAction.getRecipe(recipeId, currentUser?.user_id!);

        return {
            title: `Edit Recipe - ${data?.recipe?.title ?? "Recipe"}`,
            description: `Edit your recipe: ${data?.recipe?.title ?? "Recipe"}`
        } as Metadata;
    } catch (error) {
        return {
            title: "Edit Recipe - Not Found",
            description: "Recipe not found"
        } as Metadata;
    }
}

export default async function EditRecipe({
    params
}: {
    params: Promise<{ recipeId: string }>;
}) {
    const { recipeId } = await params;
    const queryClient = new QueryClient();
    const currentUser = await getCurrentUser();

    if (!currentUser) notFound();

    await queryClient.fetchQuery({
        queryKey: ['recipeId', Number(recipeId), currentUser.user_id],
        queryFn: () => recipeAction.getRecipe(Number(recipeId), currentUser.user_id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EditRecipePost 
                recipeId={Number(recipeId)} 
                currentUserId={currentUser.user_id!} 
                fullName={currentUser.fullname}
                username={currentUser.username}
                profileImage={currentUser.profile_image}
            />
        </HydrationBoundary>
    );
}