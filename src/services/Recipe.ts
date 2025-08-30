import { httpClient } from "@/configs/axios";

class RecipeService {
    async getRecipe(recipeId: number) {
        return httpClient.get(`/recipe/${recipeId}`);
    }

    async editRecipe(recipeId: number, data: any) {
        return httpClient.put(`/recipe/${recipeId}`, data);
    }
}

export const recipe = new RecipeService();