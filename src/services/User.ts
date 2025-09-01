import { httpClient } from "@/configs/axios";
import { UserProfileResponse } from "@/types/User";

class UserService {
    async fetchUserProfile(username: string): Promise<UserProfileResponse> {
        return await httpClient.get(`/profile/${username}`);
    }

    async fetchNotifications() {
        return await httpClient.get('/notifications');
    }

    async editUserProfile(username: string, formData: FormData) {
        return await httpClient.put(`/profile/${username}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export const user = new UserService();