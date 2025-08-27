export interface RecipeData {
	user_id: number;
	title: string;
	description?: string;
	image_url?: File | string | null;
	prep_time_minutes?: number;
	cook_time_minutes?: number;
	servings?: number;
	ingredients: { value: string }[];
	instructions: { value: string }[];
}

export type NewRecipeForm = {
	title: string;
	description?: string;
	image_url?: FileList | string | null;
	prep_time_minutes?: number;
	cook_time_minutes?: number;
	servings?: number;
	ingredients: { value: string }[];
	instructions: { value: string }[];
};