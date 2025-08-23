import { Metadata } from "next";
import LoginPage from "./login";

export const metadata: Metadata = {
    title: "Login",
    description: "Access your account",
}

export default function Login() {
    return <LoginPage />
}