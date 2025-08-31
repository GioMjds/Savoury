import { httpClient } from "@/configs/axios";
import { UserProfileResponse } from "@/types/User";

class UserService {
    async fetchUserProfile(userId: number): Promise<UserProfileResponse> {
        try {
            // The httpClient already returns response.data due to interceptor
            const data = await httpClient.get(`/profile/${userId}`);
            
            // Check if the response has the expected structure
            if (!data || !data.user) {
                throw new Error('Invalid response structure from server');
            }
            
            return data as UserProfileResponse;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    async fetchNotifications() {
        try {
            const data = await httpClient.get('/notifications');
            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async editUserProfile(userId: number, formData: FormData) {
        try {
            const data = await httpClient.put(`/profile/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        } catch (error) {
            console.error('Error editing user profile:', error);
            throw error;
        }
    }
}

export const user = new UserService();