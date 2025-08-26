import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { user } from "@/services/User";
import NotifPage from "./notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notifications",
    description: "Manage your notifications"
};

export default async function Notifications() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['notifications'],
        queryFn: user.fetchNotifications,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotifPage />
        </HydrationBoundary>
    )
}