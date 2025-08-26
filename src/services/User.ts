import { httpClient } from "@/configs/axios";

class UserService {
    async fetchUserProfile(userId: number) {
        return await httpClient.get(`/profile/${userId}`);
    }

    async fetchNotifications() {
        return await httpClient.get('/notifications');
    }
}

export const user = new UserService();