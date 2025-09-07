import { cookies } from "next/headers";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import prisma from "./prisma";

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

        const cookieStore = await cookies();

        cookieStore.set('access_token', accessToken, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        cookieStore.set('refresh_token', refreshToken, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

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

export function isValidSession(session: any): session is SessionData {
    return (
        session &&
        typeof session.userId === 'number' &&
        typeof session.email === 'string' &&
        typeof session.username === 'string'
    );
}

export async function getSession(): Promise<SessionData | null> {
    try {
        const cookieStore = await cookies();
        const accessTokenCookie = cookieStore.get('access_token');

        if (!accessTokenCookie) return null;

        const accessToken = accessTokenCookie.value;

        const { payload } = await verifyToken(accessToken);

        if (!isValidSession(payload)) return null;
        return payload;
    } catch (error) {
        console.error(`Error getting session: ${error}`);
        return null;
    }
}

export async function getCurrentUser() {
    const session = await getSession() as SessionData;

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

export async function deleteSession() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return true;
    } catch (error) {
        console.error(`Error deleting session: ${error}`);
        return false;
    }
}