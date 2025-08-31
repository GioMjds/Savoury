import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { feed } from "@/services/Feed";
import FeedPage from "./feed";

export const metadata: Metadata = {
    title: "Your Feed",
    description: "Stay updated with the latest recipes from your favorite creators.",
};

export default async function Feed() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 10, // 10 minutes
            },
        },
    });

    // Prefetch feed data for faster initial load
    try {
        await queryClient.prefetchQuery({
            queryKey: ['feed'],
            queryFn: feed.fetchFeed,
        });
    } catch (error) {
        // Handle prefetch errors gracefully - let client handle the fetch
        console.warn('Feed prefetch failed:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FeedPage />
        </HydrationBoundary>
    );
};