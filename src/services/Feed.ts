import { httpClient } from "@/configs/axios";
import { RecipeData } from "@/types/FeedResponse";

class FeedService {
    async fetchFeed() {
        return httpClient.get("/feed");
    }

    async postNewRecipe(recipeData: RecipeData) {
        return httpClient.post("/feed?feed_action=post_new_recipe", recipeData);
    }
}

export const feed = new FeedService();