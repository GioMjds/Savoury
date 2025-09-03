import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { feed } from "@/services/Feed";
import FeedPage from "./feed";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Your Feed",
    description: "Stay updated with the latest recipes from your favorite creators.",
};

export default async function Feed() {
    const queryClient = new QueryClient();
    const currentUser = await getCurrentUser();
    const currentUserId = currentUser?.user_id || null;

    await queryClient.prefetchQuery({
        queryKey: ['feed'],
        queryFn: feed.fetchFeed,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FeedPage currentUserId={currentUserId} />
        </HydrationBoundary>
    );
};