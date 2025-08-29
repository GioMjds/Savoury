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