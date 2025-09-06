import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

        const userId = session.userId;
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        const notifications = await prisma.notification.findMany({
            where: { recipient_id: userId },
            include: {
                sender: {
                    select: {
                        user_id: true,
                        fullname: true,
                        username: true,
                        profile_image: true
                    }
                },
                recipe: {
                    select: {
                        recipe_id: true,
                        title: true,
                        image_url: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            skip: offset,
            take: limit
        });

        const unreadCount = await prisma.notification.count({
            where: {
                recipient_id: userId,
                is_read: false
            }
        });

        return NextResponse.json({
            notifications,
            unreadCount,
            currentPage: page,
            totalPages: Math.ceil(unreadCount / limit),
            userId: userId
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: `Failed to fetch notifications: ${error}`
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const notificationId = searchParams.get('notificationId');

        switch (action) {
            case 'mark_read': {
                if (!notificationId) {
                    return NextResponse.json({
                        error: "Notification ID required"
                    }, { status: 400 });
                }

                await prisma.notification.update({
                    where: { 
                        notification_id: parseInt(notificationId),
                        recipient_id: session.userId
                    },
                    data: { is_read: true }
                });

                return NextResponse.json({
                    message: "Notification marked as read"
                }, { status: 200 });
            }
            case 'mark_all_read': {
                await prisma.notification.updateMany({
                    where: { recipient_id: session.userId },
                    data: { is_read: true }
                });

                return NextResponse.json({
                    message: "All notifications marked as read"
                }, { status: 200 });
            }
            default:
                return NextResponse.json({
                    error: "Invalid action"
                }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            error: `Failed to update notification: ${error}`
        }, { status: 500 });
    }
}