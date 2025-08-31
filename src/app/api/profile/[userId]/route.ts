import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: Number(userId) },
            include: {
                recipes: {
                    include: {
                        ratings: true,
                        comments: true,
                        bookmarks: true,
                        _count: {
                            select: {
                                ratings: true,
                                comments: true,
                                bookmarks: true
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                bookmarks: {
                    include: {
                        recipe: {
                            include: {
                                user: {
                                    select: {
                                        username: true,
                                        fullname: true,
                                        profile_image: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                _count: {
                    select: {
                        recipes: true,
                        bookmarks: true,
                        ratings: true,
                        comments: true
                    }
                }
            },
        });

        if (!user) {
            return NextResponse.json({ 
                error: "User not found" 
            }, { status: 404 });
        }

        const socialLinks = user.social_links ? JSON.parse(JSON.stringify(user.social_links)) : {};

        return NextResponse.json({
            message: `User ${user.fullname} retrieved successfully`,
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                fullname: user.fullname,
                profile_image: user.profile_image,
                cover_photo: user.cover_photo,
                bio: user.bio,
                social_links: socialLinks,
                created_at: user.created_at,
                recipes: user.recipes.map(recipe => ({
                    ...recipe,
                    average_rating: recipe.ratings.length > 0 
                        ? recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length 
                        : 0,
                    likes: recipe.ratings.filter(r => r.rating >= 4).length,
                })),
                bookmarks: user.bookmarks,
            },
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            error: `/api/profile/[userId] GET error: ${error}` 
        }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    
    try {
        const formData = await req.formData();
        
        // Extract text fields
        const email = formData.get('email') as string;
        const username = formData.get('username') as string;
        const fullname = formData.get('fullname') as string;
        const bio = formData.get('bio') as string || '';
        const socialLinksString = formData.get('social_links') as string;
        
        // Extract file fields
        const profileImageFile = formData.get('profile_image') as File | null;
        const coverPhotoFile = formData.get('cover_photo') as File | null;
        
        // Parse social links
        let parsedSocialLinks = null;
        if (socialLinksString) {
            try {
                parsedSocialLinks = JSON.parse(socialLinksString);
            } catch {
                return NextResponse.json({
                    error: "Invalid social_links format"
                }, { status: 400 });
            }
        }

        // Get current user data
        const currentUser = await prisma.users.findUnique({
            where: { user_id: Number(userId) },
            select: {
                profile_image: true,
                cover_photo: true
            }
        });

        if (!currentUser) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        let profileImageUrl = currentUser.profile_image;
        let coverPhotoUrl = currentUser.cover_photo;

        // Upload profile image to Cloudinary if provided
        if (profileImageFile && profileImageFile.size > 0) {
            try {
                // Convert File to Buffer
                const bytes = await profileImageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Upload to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(
                    `data:${profileImageFile.type};base64,${buffer.toString('base64')}`,
                    {
                        folder: 'profile_images',
                        resource_type: 'auto',
                        transformation: [
                            { width: 400, height: 400, crop: 'fill' },
                            { quality: 'auto' },
                            { format: 'auto' }
                        ]
                    }
                );
                profileImageUrl = uploadResult.secure_url;
            } catch (error) {
                console.error('Error uploading profile image:', error);
                return NextResponse.json({
                    error: "Failed to upload profile image"
                }, { status: 500 });
            }
        }

        // Upload cover photo to Cloudinary if provided
        if (coverPhotoFile && coverPhotoFile.size > 0) {
            try {
                // Convert File to Buffer
                const bytes = await coverPhotoFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Upload to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(
                    `data:${coverPhotoFile.type};base64,${buffer.toString('base64')}`,
                    {
                        folder: 'cover_photos',
                        resource_type: 'auto',
                        transformation: [
                            { width: 1200, height: 400, crop: 'fill' },
                            { quality: 'auto' },
                            { format: 'auto' }
                        ]
                    }
                );
                coverPhotoUrl = uploadResult.secure_url;
            } catch (error) {
                console.error('Error uploading cover photo:', error);
                return NextResponse.json({
                    error: "Failed to upload cover photo"
                }, { status: 500 });
            }
        }

        // Update user in database
        const user = await prisma.users.update({
            where: { user_id: Number(userId) },
            data: {
                email,
                username,
                fullname,
                profile_image: profileImageUrl,
                cover_photo: coverPhotoUrl,
                bio,
                social_links: parsedSocialLinks,
            },
        });

        return NextResponse.json({
            message: `User ${user.fullname} updated successfully`,
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                fullname: user.fullname,
                profile_image: user.profile_image,
                cover_photo: user.cover_photo,
                bio: user.bio,
                social_links: user.social_links,
                created_at: user.created_at,
            },
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `Failed to update user profile: ${error}`
        }, { status: 500 });
    }
}
