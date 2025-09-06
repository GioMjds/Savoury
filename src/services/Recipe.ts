import { httpClient } from "@/configs/axios";
import { CommentResponse } from "@/types/RecipeResponse";

class RecipeService {
    async getRecipe(recipeId: number) {
        return httpClient.get(`/recipe/${recipeId}?action=get_recipe_post`);
    }

    async editRecipe(recipeId: number, data: any) {
        return httpClient.put(`/recipe/${recipeId}?action=edit_recipe_post`, data);
    }

    async toggleBookmark(recipeId: number) {
        return httpClient.put(`/recipe/${recipeId}?action=bookmark`);
    }

    async likeRecipePost(recipeId: number) {
        return httpClient.post(`/recipe/${recipeId}?action=like_post`);
    }

    async postComment(recipeId: number, data: any): Promise<CommentResponse> {
        return httpClient.post(`/recipe/${recipeId}?action=new_comment`, {
            comment: data.comment
        });
    }

    async replyToComment(recipeId: number, data: { comment: string; parentCommentId: number }): Promise<CommentResponse> {
        return httpClient.post(`/recipe/${recipeId}?action=reply_to_comment`, {
            comment: data.comment,
            parentCommentId: data.parentCommentId
        });
    }

    async likeComment(recipeId: number, commentId: number) {
        return httpClient.put(`/recipe/${recipeId}?action=like_comment&commentId=${commentId}`);
    }

    async editComment(recipeId: number, commentId: number, data: any) {
        return httpClient.put(`/recipe/${recipeId}?action=edit_comment&commentId=${commentId}`, data);
    }

    async editRecipePost(recipeId: number, data: any) {
        return httpClient.put(`/recipe/${recipeId}?action=edit_recipe_post`, data);
    }

    async deleteRecipePost(recipeId: number) {
        return httpClient.delete(`/recipe/${recipeId}?action=delete_post`);
    }

    async deleteComment(recipeId: number, commentId: number) {
        return httpClient.delete(`/recipe/${recipeId}?action=delete_comment&commentId=${commentId}`);
    }

    async unlikeRecipePost(recipeId: number) {
        return httpClient.delete(`/recipe/${recipeId}?action=unlike_post`);
    }
}

export const recipeAction = new RecipeService();