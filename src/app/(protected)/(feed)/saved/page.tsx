import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { user } from "@/services/User";
import SavedPage from "./saved";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Your Saved Recipe Posts",
    description: "Your saved recipe posts"
};

export default async function Saved() {
    const queryClient = new QueryClient();
    const currentUser = await getCurrentUser();
    const userId = currentUser.user_id;

    await queryClient.fetchQuery({
        queryKey: ['saved', userId],
        queryFn: () => user.getSavedRecipePosts(userId),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SavedPage userId={userId} />
        </HydrationBoundary>
    )
}