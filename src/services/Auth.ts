import { httpClient } from "@/configs/axios";
import { RegisterPayload, LoginPayload, OtpPayload, ChangePasswordPayload, ForgotPasswordEmailPayload } from "@/types/AuthResponse";

class AuthService {
    async login(payload: LoginPayload) {
        return httpClient.post('/auth?action=login', payload);
    }

    async logout(token: string) {
        const config = httpClient.withAuth(token);
        return httpClient.post('/auth?action=logout', {}, config);
    }

    async sendRegisterOtp(payload: RegisterPayload) {
        return httpClient.post('/auth?action=send_register_otp', payload);
    }

    async resendOtp(payload: Pick<RegisterPayload, "firstName" | "lastName" | "email" | "username">) {
        return httpClient.post('/auth?action=resend_otp', payload);
    }

    async verifyRegisterOtp(payload: OtpPayload) {
        return httpClient.post('/auth?action=verify_register_otp', payload);
    }

    async forgotPasswordSendOtp(payload: ForgotPasswordEmailPayload) {
        return httpClient.post('/auth?action=forgot_pass_send_otp', payload);
    }

    async verifyForgotPassword(payload: OtpPayload) {
        return httpClient.post('/auth?action=forgot_pass_verify', payload);
    }

    async resetPassword(payload: ChangePasswordPayload) {
        return httpClient.post('/auth?action=forgot_pass_reset_pass', payload);
    }
}

export const auth = new AuthService();