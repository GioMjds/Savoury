import { type NextRequest, NextResponse } from "next/server";
import { cookiesToDelete, createSession } from "@/lib/auth";
import { otpStorage } from "@/configs/otp";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { compare, hash } from "bcrypt"
import fs from "fs";
import path from "path";
import { sendOtpEmail } from "@/configs/email";

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
                        error: "Wrong password"
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
                const { firstName, lastName, email, username, password, confirmPassword } = await req.json();

                if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
                    return NextResponse.json({
                        error: "All fields are required"
                    }, { status: 400 });
                }

                if (!firstName || !lastName) {
                    return NextResponse.json({
                        error: "First name and last name are required"
                    }, { status: 400 });
                }

                if (!email || !username) {
                    return NextResponse.json({
                        error: "Email and username are required"
                    }, { status: 400 });
                }

                if (password !== confirmPassword) {
                    return NextResponse.json({
                        error: "Passwords do not match"
                    }, { status: 400 });
                }

                const existingUsername = await prisma.users.findUnique({
                    where: { username: username }
                });

                if (existingUsername) {
                    return NextResponse.json({
                        error: "Username already taken"
                    }, { status: 409 });
                }

                const existingEmail = await prisma.users.findUnique({
                    where: { email: email }
                });

                if (existingEmail) {
                    return NextResponse.json({
                        error: "Email already taken"
                    }, { status: 409 });
                }

                const otp = Math.floor(10000 + Math.random() * 90000).toString();
                const hashedPassword = await hash(password, 12);

                otpStorage.set(firstName, lastName, email, otp, hashedPassword, username);

                await sendOtpEmail(email, otp);

                return NextResponse.json({
                    message: "OTP sent successfully"
                }, { status: 200 });
            }
            case "resend_otp": {
                const { firstName, lastName, email, username } = await req.json();
            
                if (!email) {
                    return NextResponse.json({
                        error: "Email is required"
                    }, { status: 400 });
                }

                const otpCache = otpStorage.get(email);
                
                if (!otpCache) {
                    return NextResponse.json({
                        error: "No OTP request found for this email. Please initiate registration again."
                    }, { status: 404 });
                }

                const newOtp = Math.floor(10000 + Math.random() * 90000).toString();

                otpStorage.set(firstName, lastName, email, newOtp, otpCache.hashedPassword, username);

                await sendOtpEmail(email, newOtp);

                return NextResponse.json({
                    message: "OTP resent successfully"
                }, { status: 200 });
            }
            case "verify_register_otp": {
                const { email, otp } = await req.json();
            
                const validation = otpStorage.validate(email, otp);
            
                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                const hashedPassword = validation.data?.hashedPassword;
                const firstName = validation.data?.firstName;
                const lastName = validation.data?.lastName;
                const username = validation.data?.username;

                if (!hashedPassword) {
                    return NextResponse.json({
                        error: "Failed to retrieve hashed password"
                    }, { status: 400 });
                }

                if (!firstName || !lastName || !username) {
                    return NextResponse.json({
                        error: "Failed to retrieve user data"
                    }, { status: 400 });
                }

                let profileImgUrl: string = "";

                try {
                    const defaultPath = path.join(
                        process.cwd(),
                        'public',
                        'Default_pfp.jpg'
                    );
                    const imgBuffer = fs.readFileSync(defaultPath);
                    const base64Items = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;

                    const uploadResponse = await cloudinary.uploader.upload(
                        base64Items,
                        {
                            folder: "savoury/profiles",
                            public_id: `user_${email.replace(/[@.]/g, "_")}`,
                            overwrite: true,
                            resource_type: "image"
                        }
                    );
                    profileImgUrl = uploadResponse.secure_url;
                } catch (error) {
                    console.error(`Error uploading profile image: ${error}`);
                }

                const newUser = await prisma.users.create({
                    data: {
                        fullname: `${firstName} ${lastName}`,
                        email: email,
                        username: username,
                        password: hashedPassword,
                        profile_image: profileImgUrl,
                        social_links: {},
                        bio: "",
                        
                    }
                });

                return NextResponse.json({
                    message: "User registered successfully",
                    user: {
                        fullname: newUser.fullname,
                        email: newUser.email,
                        username: newUser.username,
                        profile_image: newUser.profile_image
                    }
                }, { status: 201 });
            }
            case "forgot_pass_send_otp": {
                const { email } = await req.json();

                if (!email) {
                    return NextResponse.json({
                        error: "Email is required"
                    }, { status: 400 });
                }

                const user = await prisma.users.findUnique({
                    where: { email: email }
                });

                if (!user) {
                    return NextResponse.json({
                        error: "User not found"
                    }, { status: 404 });
                }

                const otp = Math.floor(10000 + Math.random() * 90000).toString();

                otpStorage.set("", "", email, otp, user.password!, user.username);
            
                await sendOtpEmail(email, otp);

                return NextResponse.json({
                    message: "OTP sent successfully"
                }, { status: 200 });
            }
            case "forgot_pass_verify": {
                const { email, otp } = await req.json();

                if (!email || !otp) {
                    return NextResponse.json({
                        error: "Email and OTP are required"
                    }, { status: 400 });
                }

                const validation = otpStorage.validate(email, otp);

                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                return NextResponse.json({
                    message: "OTP verified successfully"
                }, { status: 200 });
            }
            case "forgot_pass_reset_pass": {
                const { email, otp, newPassword, confirmPassword } = await req.json();
            
                if (!email || !otp || !newPassword) {
                    return NextResponse.json({
                        error: "Email, OTP, and new password are required"
                    }, { status: 400 });
                }

                if (newPassword !== confirmPassword) {
                    return NextResponse.json({
                        error: "New password and confirm password do not match"
                    }, { status: 400 });
                }

                const validation = otpStorage.validate(email, otp);

                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                const hashedPassword = await hash(newPassword, 12);

                await prisma.users.update({
                    where: { email: email },
                    data: { password: hashedPassword }
                });

                otpStorage.delete(email);

                return NextResponse.json({
                    message: "Password reset successfully"
                }, { status: 200 });
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