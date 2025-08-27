import type { Metadata } from "next";
import PostNewRecipe from "./new-post";

export const metadata: Metadata = {
    title: "Post New Recipe",
    description: "Post your new recipe",
};

export default function New() {
    return <PostNewRecipe />;
}