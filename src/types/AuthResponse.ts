export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface OtpPayload {
    email: string;
    otp: string;
}

export interface ChangePasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ForgotPasswordEmailPayload {
    email: string;
}