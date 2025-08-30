interface RecipeUser {
    user_id: number;
    fullname: string;
    username: string;
    profile_image: string;
}

interface RecipeIngredient {
    quantity: number | null;
    unit: string | null;
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
    description: string | null;
    image_url: string | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    servings: number | null;
    category: string | null;
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