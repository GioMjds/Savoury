import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { feed } from "@/services/Feed";
import FeedPage from "./feed";

export const metadata: Metadata = {
    title: "Your Feed",
    description: "Stay updated with the latest recipes from your favorite creators.",
};

export default async function Feed() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['feed'],
        queryFn: feed.fetchFeed,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FeedPage />
        </HydrationBoundary>
    );
};