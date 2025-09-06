import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { feed } from "@/services/Feed";
import SearchResultsPage from "./search-results";

export const metadata: Metadata = {
    title: "Search",
    description: "Search results here..."
};

export default async function Search() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['search'],
        queryFn: feed.searchRecipePost,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SearchResultsPage />
        </HydrationBoundary>
    )
}