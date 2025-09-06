import { httpClient } from "@/configs/axios";
import { UserProfileResponse } from "@/types/User";

interface NotificationsParams {
    page?: number;
    limit?: number;
}

class UserService {
    async fetchUserProfile(username: string): Promise<UserProfileResponse> {
        return await httpClient.get(`/profile/${username}`);
    }

    async fetchNotifications(params: NotificationsParams) {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());

        const queryString = searchParams.toString();
        const url = queryString ? `/notifications?${queryString}` : '/notifications';

        return await httpClient.get(url);
    }

    async markNotificationAsRead(notificationId: number) {
        return await httpClient.put(`/notifications?action=mark_read&notificationId=${notificationId}`);
    }

    async markAllNotificationsAsRead() {
        return await httpClient.put('/notifications?action=mark_all_read');
    }

    async editUserProfile(username: string, formData: FormData) {
        return await httpClient.put(`/profile/${username}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async getSavedRecipePosts(userId: number) {
        return await httpClient.get(`/saved/${userId}`);
    }
}

export const user = new UserService();