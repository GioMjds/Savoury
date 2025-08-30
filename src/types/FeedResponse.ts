export enum FoodCategories {
    Breakfast = "breakfast",
    Lunch = "lunch",
    Dinner = "dinner",
    Dessert = "dessert",
    Appetizer = "appetizer",
    Snack = "snack",
    Soup = "soup",
    Beverage = "beverage",
    Salad = "salad",
    SideDish = "side_dish"
}

export interface IngredientInput {
    quantity?: number | string;
    unit?: string;
    ingredient_name: string;
}

export interface RecipeData {
    user_id: number;
    title: string;
    category: string;
    description?: string;
    image_url?: File | string | null;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    servings?: number;
    ingredients: IngredientInput[];
    instructions: { value: string }[];
}

export type NewRecipeForm = {
    title: string;
    description?: string;
    image_url?: FileList | string | null;
    prep_time_minutes: number;
    cook_time_minutes: number;
    servings: number;
    ingredients: IngredientInput[];
    instructions: { value: string }[];
    category: string;
};

// Feed Response Types
export interface FeedRecipeUser {
    user_id: number;
    fullname: string;
    username: string;
    profile_image: string;
}

export interface FeedRecipeIngredient {
    quantity: number | null;
    unit: string | null;
    ingredient: {
        ingredient_id: number;
        ingredient_name: string;
    };
}

export interface FeedRecipeInstruction {
    step_number: number;
    step_text: string;
}

export interface FeedRecipeRating {
    rating_id: number;
    rating: number;
}

export interface FeedRecipeComment {
    comment_id: number;
    comment_text: string;
}

export interface FeedRecipe {
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
    user: FeedRecipeUser;
    recipeIngredients: FeedRecipeIngredient[];
    instructions: FeedRecipeInstruction[];
    ratings: FeedRecipeRating[];
    comments: FeedRecipeComment[];
}

export interface FeedResponse {
    message: string;
    feed: FeedRecipe[];
}