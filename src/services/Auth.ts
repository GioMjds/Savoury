import { httpClient } from "@/configs/axios";
import { RegisterPayload, LoginPayload, OtpPayload } from "@/types/AuthResponse";

export class AuthService {
    async login(payload: LoginPayload) {
        return httpClient.post('/auth?action=login', payload);
    }

    async logout(token?: string) {
        const config = token ? httpClient.withAuth(token) : undefined;
        return httpClient.post('/auth?action=logout', {}, config);
    }

    async sendRegisterOtp(payload: RegisterPayload) {
        return httpClient.post('/auth?action=send_register_otp', payload);
    }

    async resendOtp(payload: Pick<RegisterPayload, "firstName" | "lastName" | "email" | "username">) {
        return httpClient.post('/auth?action=resend_register_otp', payload);
    }

    async verifyRegisterOtp(payload: OtpPayload) {
        return httpClient.post('/auth?action=verify_register_otp', payload);
    }
}

export const auth = new AuthService();