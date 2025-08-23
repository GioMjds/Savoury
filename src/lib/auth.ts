import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import prisma from "./prisma";
import { Session } from "inspector/promises";

interface SessionData extends JWTPayload {
    userId: number;
    email: string;
    username: string;
}

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(encodedKey);
};

export async function decrypt(token: string) {
    const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ["HS256"]
    });
    return payload;
};

export async function createSession(userId: number) {
    try {
        if (!secretKey) {
            console.error("JWT secret key is not defined");
            return null;
        }

        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: { email: true, username: true }
        });

        if (!user) throw new Error("User not found", { cause: 404 });

        const sessionData: SessionData = {
            userId,
            email: user.email,
            username: user.username
        };

        const accessToken = await new SignJWT(sessionData)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(encodedKey);

        const refreshToken = await new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(encodedKey);

        return { sessionData, accessToken, refreshToken };
    } catch (error) {
        console.error(`Error creating session: ${error}`);
        throw error;
    }
};

export async function verifyToken(token: string) {
    return jwtVerify(token, encodedKey);
};

export async function cookiesToDelete() {
    return ['access_token', 'refresh_token'];
};

export async function getSession(): Promise<SessionData | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;
        if (!accessToken) return null;

        const { payload } = await verifyToken(accessToken);
        return payload as SessionData;
    } catch (error) {
        console.error(`Error getting session: ${error}`);
        return null;
    }
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    try {
        return await prisma.users.findUnique({
            where: { user_id: session.userId },
            select: {
                user_id: true,
                fullname: true,
                email: true,
                profile_image: true,
                username: true,
            }
        });
    } catch (error) {
        console.error(`Error getting current user: ${error}`);
        return null;
    }
}