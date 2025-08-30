import { httpClient } from '@/configs/axios';
import { RecipeData, FeedResponse, FeedRecipe } from '@/types/FeedResponse';

class FeedService {
	async fetchFeed(): Promise<FeedResponse> {
		return await httpClient.get<FeedResponse>('/feed');
	}

	async postNewRecipe(recipeData: RecipeData) {
		const formData = new FormData();

		formData.append('user_id', recipeData.user_id.toString());
		formData.append('title', recipeData.title);
		formData.append('category', recipeData.category);

		if (recipeData.description) {
			formData.append('description', recipeData.description);
		}

		if (recipeData.prep_time_minutes) {
			formData.append(
				'prep_time_minutes',
				recipeData.prep_time_minutes.toString()
			);
		}

		if (recipeData.cook_time_minutes) {
			formData.append(
				'cook_time_minutes',
				recipeData.cook_time_minutes.toString()
			);
		}

		if (recipeData.servings) {
			formData.append('servings', recipeData.servings.toString());
		}

		formData.append('ingredients', JSON.stringify(recipeData.ingredients));
		formData.append(
			'instructions',
			JSON.stringify(recipeData.instructions)
		);

		if (recipeData.image_url instanceof File) {
			formData.append('image_url', recipeData.image_url);
		}

		return httpClient.post('/feed?feed_action=post_new_recipe', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
}

export const feed = new FeedService();
export type { FeedRecipe, FeedResponse };
