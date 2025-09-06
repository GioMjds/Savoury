import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { user } from "@/services/User";
import NotifPage from "./notifications";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Notifications",
    description: "Manage your notifications"
};

export default async function Notifications() {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: ['notifications', 1],
            queryFn: () => user.fetchNotifications({ page: 1, limit: 10 }),
        });
    } catch (error) {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotifPage />
        </HydrationBoundary>
    )
}