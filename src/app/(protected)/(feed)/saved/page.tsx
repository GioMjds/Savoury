import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import SavedPage from "./saved";
import { user } from "@/services/User";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Your Saved Recipe Posts",
    description: "Your saved recipe posts"
};

export default async function Saved() {
    const queryClient = new QueryClient();
    const session = await getSession();

    if (!session) return null;

    await queryClient.prefetchQuery({
        queryKey: ['saved'],
        queryFn: () => user.getSavedRecipePosts(session?.userId),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SavedPage />
        </HydrationBoundary>
    )
}