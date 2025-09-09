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

interface RecipeComment {
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
	likes?: Array<{ user_id: number; comment_like_id: number }>;
	replies?: RecipeComment[];
	_count?: {
		likes: number;
		replies: number;
	};
}

export interface LikeApiResponse {
	success: boolean;
	message: string;
	data: {
		isLiked: boolean;
		likesCount: number;
		recipeId: number;
	};
}

export interface Recipe {
	recipe_id: number;
	title: string;
	description: string;
	image_url: string;
	prep_time_value: number;
	prep_time_unit: string;
	cook_time_value: number;
	cook_time_unit: string;
	servings: number;
	category: string;
	created_at: string;
	likes: number;
	user: RecipeUser;
	recipeIngredients: RecipeIngredient[];
	instructions: RecipeInstruction[];
	comments: RecipeComment[];
	userLikes: Array<{ user_like_id: number; user_id: number; created_at: string }>;
	bookmarks: Array<{ user_id: number }>;
	isBookmarked?: boolean;
	isLiked: boolean;
}

export type UnifiedRecipe = Recipe | import("@/types/FeedResponse").FeedRecipe;

export interface PostBlockProps {
	recipe: UnifiedRecipe;
	currentUserId: number;
	currentUser: {
		user_id: number;
		profile_image: string;
		fullname: string;
		username: string;
	};
}

export interface Comment {
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
	likes?: Array<{ user_id: number; comment_like_id?: number }>;
	replies?: Comment[];
	_count?: {
		likes: number;
		replies: number;
	};
}

export interface CommentResponse {
	success: boolean;
	message: string;
	data: {
		comment: {
			comment_id: number;
			comment_text: string;
			created_at: string;
			user: {
				user_id: number;
				username: string;
				fullname: string;
				profile_image: string;
			};
			recipe_id: number;
		};
		notification?: {
			id: number;
			type: string;
			message: string;
			sender: {
				user_id: number;
				username: string;
				fullname: string;
				profile_image: string;
			};
			recipe: {
				recipe_id: number;
				title: string;
				image_url: string;
			};
			created_at: string;
		} | null;
	};
}

export interface RecipePostProps {
	recipeId: number;
	currentUserId: number;
}

export interface RecipeApiResponse {
	success: boolean;
	recipe: Recipe;
}

export interface User {
	user_id: number;
	username: string;
	fullname: string;
	profile_image: string;
}

export interface CommentLike {
	user_id: number;
	comment_like_id: number;
}

export interface CommentCount {
	likes: number;
	replies: number;
}

export type TabType = 'ingredients' | 'instructions';

export interface BookmarkUser {
    user_id: number;
    username: string;
    email: string;
    fullname: string;
    password: string;
    profile_image: string;
    cover_photo: string;
    bio: string;
    social_links: Record<string, string>;
    gender: string | null;
    pronouns: string | null;
    created_at: string;
}

export interface BookmarkRecipe {
    recipe_id: number;
    user_id: number;
    title: string;
    description: string;
    image_url: string;
    prep_time_value: number;
    prep_time_unit: string;
    cook_time_value: number;
    cook_time_unit: string;
    servings: number;
    category: string;
    average_rating: string;
    created_at: string;
    likes: number;
}

export interface Bookmark {
    bookmark_id: number;
    user_id: number;
    recipe_id: number;
    created_at: string;
    recipe: BookmarkRecipe;
    user: BookmarkUser;
}

export interface SavedResponse {
    bookmark: Bookmark[];
}