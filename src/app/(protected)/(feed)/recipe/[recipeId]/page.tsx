import type { Metadata } from 'next';
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import GetRecipePost from './get-recipe-post';
import { recipeAction } from '@/services/Recipe';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ recipeId: number }>;
}): Promise<Metadata> {
	const { recipeId } = await params;
	const currentUser = await getCurrentUser();
	const currentUserId = currentUser?.user_id;

	try {
		const data = await recipeAction.getRecipe(recipeId, currentUserId!);

		if (!data) {
			return {
				title: 'Recipe Not Found',
				description: 'The requested recipe could not be found.',
			};
		}

		return {
			title: `${data.recipe.title} by @${data.recipe.user.username}`,
			description: `Check out @${data.recipe.user.username}'s recipe for ${data.recipe.title} on Savoury!`,
		};
	} catch {
		return {
			title: 'Error fetching recipe',
			description: 'There was an error fetching the recipe details.',
		};
	}
}

export default async function RecipePostId({
	params,
}: {
	params: Promise<{ recipeId: number }>;
}) {
	const { recipeId } = await params;
    const queryClient = new QueryClient();
    const currentUser = await getCurrentUser();
    const currentUserId = currentUser?.user_id || null;

	try {
		const data = await queryClient.fetchQuery({
			queryKey: ['recipeId', recipeId],
			queryFn: () => recipeAction.getRecipe(recipeId, currentUserId!),
		});
		if (!data) return notFound();
	} catch {
		notFound();
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GetRecipePost recipeId={recipeId} currentUserId={currentUserId} />
		</HydrationBoundary>
	);
}
