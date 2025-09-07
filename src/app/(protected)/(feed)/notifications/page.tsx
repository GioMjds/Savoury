import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { user } from "@/services/User";
import NotifPage from "./notifications";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Notifications",
    description: "Manage your notifications"
};

export default async function Notifications() {
    const queryClient = new QueryClient();
    const currentUser = await getCurrentUser();
    const currentUserId = currentUser?.user_id || null;

    try {
        await queryClient.fetchQuery({
            queryKey: ['notifications', 1],
            queryFn: () => user.fetchNotifications({ page: 1, limit: 10, userId: currentUserId }),
        });
    } catch (error) {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotifPage userId={currentUserId} />
        </HydrationBoundary>
    )
}