interface RecipeUser {
    user_id: number;
    fullname: string;
    username: string;
    profile_image: string;
}

interface RecipeIngredient {
    quantity: number;
    unit: string;
    ingredient: {
        ingredient_id: number;
        ingredient_name: string;
    };
}

interface RecipeInstruction {
    step_number: number;
    step_text: string;
}

interface RecipeRating {
    rating_id: number;
    rating: number;
}

interface RecipeComment {
    comment_id: number;
    comment_text: string;
}

export interface Recipe {
    recipe_id: number;
    title: string;
    description: string;
    image_url: string;
    prep_time_minutes: number;
    cook_time_minutes: number;
    servings: number;
    category: string;
    average_rating: number;
    created_at: string;
    user: RecipeUser;
    recipeIngredients: RecipeIngredient[];
    instructions: RecipeInstruction[];
    ratings: RecipeRating[];
    comments: RecipeComment[];
}

export interface PostBlockProps {
    recipe: Recipe;
}