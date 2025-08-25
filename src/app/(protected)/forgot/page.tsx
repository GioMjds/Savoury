import type { Metadata } from "next";
import ForgotPasswordPage from "./forgot";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
}

export default function Forgot() {
    return <ForgotPasswordPage />
}