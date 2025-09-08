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
    prep_time_value?: number;
    prep_time_unit?: string;
    cook_time_value?: number;
    cook_time_unit?: string;
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

interface SocialLinks {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    github?: string;
    linkedin?: string;
    website?: string;
}

interface UserStats {
    totalRecipes: number;
    totalBookmarks: number;
    totalRatings: number;
    totalComments: number;
}

export interface UserProfileResponse {
    user: {
        user_id: number;
        email: string;
        username: string;
        fullname: string;
        profile_image: string;
        cover_photo?: string;
        bio?: string;
        gender?: string;
        pronouns?: string;
        social_links?: SocialLinks;
        created_at: string;
        recipes: Array<{
            recipe_id: number;
            title: string;
            description?: string;
            image_url?: string;
            prep_time_value?: number;
            prep_time_unit?: string;
            cook_time_value?: number;
            cook_time_unit?: string;
            servings?: number;
            category?: string;
            average_rating: number;
            likes: number;
            created_at: string;
            _count?: {
                ratings: number;
                comments: number;
                bookmarks: number;
            };
        }>;
        bookmarks: Array<{
            bookmark_id: number;
            created_at: string;
            recipe: {
                recipe_id: number;
                title: string;
                image_url?: string;
                user: {
                    username: string;
                    fullname: string;
                    profile_image: string;
                };
            };
        }>;
        stats: UserStats;
    };
}