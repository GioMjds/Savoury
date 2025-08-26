import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { user } from "@/services/User";
import ProfilePage from "./profile";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    try {
        const data = await user.fetchUserProfile(Number(userId));

        if (!data) {
            return {
                title: 'User Not Found',
            };
        }

        return {
            title: `${data.user.fullname} | Savoury`,
            description: `View ${data.user.fullname}'s recipes and cooking profile on Savoury`
        }
    } catch {
        return {
            title: 'Error Fetching User',
        };
    }
}

export default async function Profile({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: ['profile', Number(userId)],
            queryFn: () => user.fetchUserProfile(Number(userId))
        });
    } catch (error) {
        console.error('Failed to prefetch user profile:', error);
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfilePage userId={Number(userId)} />
        </HydrationBoundary>
    )
}