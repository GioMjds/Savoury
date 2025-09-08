import { httpClient } from "@/configs/axios";
import { CommentResponse } from "@/types/RecipeResponse";

class RecipeService {
    async getRecipe(recipeId: number, userId: number) {
        return httpClient.get(`/recipe/${recipeId}/${userId}?action=get_recipe_post`);
    }

    async editRecipe(recipeId: number, userId: number, data: any) {
        return httpClient.put(`/recipe/${recipeId}/${userId}?action=edit_recipe_post`, data);
    }

    async toggleBookmark(recipeId: number, userId: number) {
        return httpClient.put(`/recipe/${recipeId}/${userId}?action=bookmark`, {});
    }

    async likeRecipePost(recipeId: number, userId: number) {
        return httpClient.post(`/recipe/${recipeId}/${userId}?action=like_post`);
    }

    async postComment(recipeId: number, userId: number, data: any): Promise<CommentResponse> {
        return httpClient.post(`/recipe/${recipeId}/${userId}?action=new_comment`, {
            comment: data.comment
        });
    }

    async replyToComment(recipeId: number, userId: number, data: { comment: string; parentCommentId: number }): Promise<CommentResponse> {
        return httpClient.post(`/recipe/${recipeId}/${userId}?action=reply_to_comment`, {
            comment: data.comment,
            parentCommentId: data.parentCommentId
        });
    }

    async likeComment(recipeId: number, userId: number, commentId: number) {
        return httpClient.put(`/recipe/${recipeId}/${userId}?action=like_comment&commentId=${commentId}`);
    }

    async editComment(recipeId: number, userId: number, commentId: number, data: any) {
        return httpClient.put(`/recipe/${recipeId}/${userId}?action=edit_comment&commentId=${commentId}`, data);
    }

    async editRecipePost(recipeId: number, userId: number, data: any) {
        return httpClient.put(`/recipe/${recipeId}/${userId}?action=edit_recipe_post`, data);
    }

    async deleteRecipePost(recipeId: number, userId: number) {
        return httpClient.delete(`/recipe/${recipeId}/${userId}?action=delete_post`);
    }

    async deleteComment(recipeId: number, userId: number, commentId: number) {
        return httpClient.delete(`/recipe/${recipeId}/${userId}?action=delete_comment&commentId=${commentId}`);
    }

    async unlikeRecipePost(recipeId: number, userId: number) {
        return httpClient.delete(`/recipe/${recipeId}/${userId}?action=unlike_post`);
    }
}

export const recipeAction = new RecipeService();