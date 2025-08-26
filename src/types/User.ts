export interface User {
    user_id: number;
    username: string;
    email: string;
    fullname: string;
    profile_image: string;
    created_at: string;
}

export interface Recipe {
    recipe_id: number;
    user_id: number;
    title: string;
    description?: string;
    image_url?: string;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    servings?: number;
    average_rating: number;
    created_at: string;
}

export interface Comment {
    comment_id: number;
    user_id: number;
    recipe_id: number;
    comment_text: string;
    created_at: string;
}

export interface Rating {
    rating_id: number;
    user_id: number;
    recipe_id: number;
    rating: number;
    created_at: string;
}

export interface UserProfile extends User {
    recipes: Recipe[];
    comments: Comment[];
    ratings: Rating[];
}

export interface UserProfileResponse {
    message: string;
    user: UserProfile;
}
