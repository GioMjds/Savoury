import { httpClient } from "@/configs/axios";

class RecipeService {
    async getRecipe(recipeId: number) {
        return httpClient.get(`/recipe/${recipeId}`);
    }
}

export const recipe = new RecipeService();