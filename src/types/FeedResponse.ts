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

export type TimeUnit = 'minutes' | 'hours' | 'days';

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
    prep_time_value?: number;
    prep_time_unit?: TimeUnit;
    cook_time_value?: number;
    cook_time_unit?: TimeUnit;
    servings?: number;
    ingredients: IngredientInput[];
    instructions: { value: string }[];
}

export type NewRecipeForm = {
    title: string;
    description?: string;
    image_url?: FileList | string | null;
    prep_time_value: number;
    prep_time_unit: TimeUnit;
    cook_time_value: number;
    cook_time_unit: TimeUnit;
    servings: number;
    ingredients: IngredientInput[];
    instructions: { value: string }[];
    category: string;
};

export interface FeedRecipeUser {
    user_id: number;
    fullname: string;
    username: string;
    profile_image: string;
}

export interface FeedRecipeIngredient {
    recipe_ingredient_id?: number;
    recipe_id?: number;
    ingredient_id?: number;
    quantity: number | string | null;
    unit: string | null;
    ingredient: {
        ingredient_id: number;
        ingredient_name: string;
    };
}

export interface FeedRecipeInstruction {
    instruction_id?: number;
    recipe_id?: number;
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
    comment_likes: number;
    created_at: string;
    parent_comment_id?: number;
    user: {
        user_id: number;
        username: string;
        fullname: string;
        profile_image: string;
    };
    likes: Array<{ user_id: number }>;
    replies?: FeedRecipeComment[];
    _count?: {
        likes: number;
        replies: number;
    };
}

export interface FeedRecipe {
    recipe_id: number;
    user_id?: number;
    title: string;
    description: string | null;
    image_url: string | null;
    prep_time_value: number | null;
    prep_time_unit: TimeUnit | null;
    cook_time_value: number | null;
    cook_time_unit: TimeUnit | null;
    servings: number | null;
    category: string;
    average_rating?: number;
    created_at: string;
    user: FeedRecipeUser;
    likes: number;
    recipeIngredients: FeedRecipeIngredient[];
    instructions: FeedRecipeInstruction[];
    ratings?: FeedRecipeRating[];
    comments: FeedRecipeComment[];
    userLikes: Array<{ user_like_id: number; user_id: number; created_at: string }>;
    bookmarks: Array<{ user_id: number }>;
    isBookmarked: boolean;
    isLiked: boolean;
}

export interface FeedResponse {
    success: boolean;
    feed: FeedRecipe[];
}