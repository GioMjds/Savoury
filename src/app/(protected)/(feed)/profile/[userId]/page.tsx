import { user } from "@/services/User";
import ProfilePage from "./profile";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";

export async function generateMetadata(
    { params }: { params: Promise<{ userId: number }> }
): Promise<Metadata> {
    const { userId } = await params;

    try {
        const data = await user.fetchUserProfile(userId);

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

export default async function Profile({ params }: { params: Promise<{ userId: number }> }) {
    const { userId } = await params;
    const currentUser = await getCurrentUser();

    return (
        <ProfilePage 
            userId={userId} 
            currentUserId={currentUser?.user_id || null} 
        />
    )
}