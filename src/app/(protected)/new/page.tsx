import type { Metadata } from "next";
import PostNewRecipe from "./new-post";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Post New Recipe",
    description: "Post your new recipe",
};

export default async function New() {
    const data = await getCurrentUser();

    return (
        <PostNewRecipe 
            userId={data?.user_id as number} 
            username={data?.username as string}
            profileImage={data?.profile_image as string}
            fullName={data?.fullname as string}
        />
    );
}