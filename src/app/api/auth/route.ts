import { type NextRequest, NextResponse } from "next/server";
import { cookiesToDelete, createSession } from "@/lib/auth";
import { otpStorage } from "@/configs/otp";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { compare, hash } from "bcrypt"
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get('action');

        switch (action) {
            case "logout": {
                const sessionId = req.cookies.get('access_token')?.value;

                if (!sessionId) {
                    return NextResponse.json({
                        error: "Unauthorized - No session found"
                    }, { status: 401 });
                }

                const response = NextResponse.json({
                    message: "Logged out successfully"
                }, { status: 200 });

                const cookieDeletion = await cookiesToDelete();

                for (const cookie of cookieDeletion) {
                    response.cookies.delete(cookie);
                }

                return response;
            }
            case "login": {
                const { identifier, password } = await req.json();
            
                const user = await prisma.users.findFirst({
                    where: {
                        OR: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    }
                });

                if (!identifier || !password) {
                    return NextResponse.json({
                        error: "Email or username and password are required."
                    }, { status: 400 });
                }

                if (!user) {
                    return NextResponse.json({
                        error: "No user found"
                    }, { status: 404 });
                }

                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    return NextResponse.json({
                        error: "Invalid password"
                    }, { status: 401 });
                }

                const session = await createSession(user.user_id);

                if (!session) {
                    return NextResponse.json({
                        error: "Failed to create session"
                    }, { status: 500 });
                }

                const response = NextResponse.json({
                    message: `Logged in successfully! Name: ${user.fullname}`,
                    user: {
                        id: user.user_id,
                        email: user.email,
                        fullname: user.fullname,
                        profile_image: user.profile_image,
                        username: user.username
                    }
                }, { status: 200 });

                response.cookies.set({
                    name: 'access_token',
                    value: session.accessToken,
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24
                });

                response.cookies.set({
                    name: 'refresh_token',
                    value: session.refreshToken,
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7
                });

                return response;
            }
            case "send_register_otp": {

            }
            case "verify_register_otp": {

            }
            case "resend_otp": {
                
            }
            default: {
                return NextResponse.json({
                    error: "Invalid action"
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/auth POST error: ${error}`
        }, { status: 500 });
    }
}