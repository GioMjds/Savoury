import { httpClient } from '@/configs/axios';
import { RecipeData } from '@/types/FeedResponse';

class FeedService {
	async fetchFeed() {
		return httpClient.get('/feed');
	}

	async postNewRecipe(recipeData: RecipeData) {
		const formData = new FormData();

		formData.append('user_id', recipeData.user_id.toString());
		formData.append('title', recipeData.title);

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

		// Append arrays as JSON strings
		formData.append('ingredients', JSON.stringify(recipeData.ingredients));
		formData.append(
			'instructions',
			JSON.stringify(recipeData.instructions)
		);

		// DEBUG: Log what we're receiving
		console.log('Service - Received image_url type:', typeof recipeData.image_url);
		console.log('Service - Received image_url instanceof File:', recipeData.image_url instanceof File);
		console.log('Service - Received image_url value:', recipeData.image_url);

		// Handle image file - FIXED LOGIC
		if (recipeData.image_url instanceof File) {
			console.log('Service - Appending File to FormData:', {
				name: recipeData.image_url.name,
				size: recipeData.image_url.size,
				type: recipeData.image_url.type,
			});
			formData.append('image_url', recipeData.image_url);
		} else {
			console.log('Service - No image file provided or image_url is not a File');
		}

		// Debug FormData contents
		console.log('Service - FormData entries:');
		for (let [key, value] of formData.entries()) {
			if (value instanceof File) {
				console.log(
					`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`
				);
			} else {
				console.log(`${key}:`, value);
			}
		}

		return httpClient.post('/feed?feed_action=post_new_recipe', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
}

export const feed = new FeedService();
