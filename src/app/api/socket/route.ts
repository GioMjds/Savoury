import { type NextRequest, NextResponse } from "next/server";
import { Server as ServerIO } from "socket.io";
import type { Server as NetServer, IncomingMessage } from "http";
import type { NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export const config = {
    runtime: "nodejs"
};

type NextApiResponseServerIO = NextApiResponse & {
    socket: {
        server: NetServer & {
            io: ServerIO;
        };
    };
};

let io: ServerIO;

export async function GET(req: NextRequest) {
    if (!io) {
        const httpServer = (global as any).httpServer;
        
        if (!httpServer) {
            const { createServer } = await import("http");
            const server = createServer();
            (global as any).httpServer = server;
            
            io = new ServerIO(server, {
                path: "/api/socket/io",
                addTrailingSlash: false,
                cors: {
                    origin: process.env.NODE_ENV === "production" 
                        ? process.env.NEXTAUTH_URL 
                        : "http://localhost:3000",
                    methods: ["GET", "POST"],
                    credentials: true
                }
            });

            setupSocketHandlers(io);
            
            // Store io globally
            (global as any).io = io;
        } else {
            io = (global as any).io;
        }
    }

    return NextResponse.json({ 
        success: true, 
        message: "Socket.IO server initialized" 
    }, { status: 200 });
}

function setupSocketHandlers(io: ServerIO) {
    io.on("connection", (socket) => {
        // Join user to their personal room for notifications
        socket.on("join-user-room", (userId: string) => {
            socket.join(`user:${userId}`);
            console.log(`User ${userId} joined their personal room`);
        });

        // Join recipe room for real-time comments
        socket.on("join-recipe-room", (recipeId: string) => {
            socket.join(`recipe:${recipeId}`);
            console.log(`User joined recipe room: ${recipeId}`);
        });

        // Leave recipe room
        socket.on("leave-recipe-room", (recipeId: string) => {
            socket.leave(`recipe:${recipeId}`);
            console.log(`User left recipe room: ${recipeId}`);
        });

        // Handle new comment
        socket.on("new-comment", async (data: {
            recipeId: number;
            userId: number;
            commentText: string;
        }) => {
            try {
                const comment = await prisma.comment.create({
                    data: {
                        recipe_id: data.recipeId,
                        user_id: data.userId,
                        comment_text: data.commentText
                    },
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                fullname: true,
                                username: true,
                                profile_image: true
                            }
                        }
                    }
                });

                // Get recipe owner for notification
                const recipe = await prisma.recipe.findUnique({
                    where: { recipe_id: data.recipeId },
                    select: { user_id: true, title: true }
                });

                // Broadcast to recipe room
                io.to(`recipe:${data.recipeId}`).emit("comment-added", {
                    comment: {
                        comment_id: comment.comment_id,
                        comment_text: comment.comment_text,
                        created_at: comment.created_at,
                        user: comment.user
                    }
                });

                // Send notification to recipe owner (if not commenting on own recipe)
                if (recipe && recipe.user_id !== data.userId) {
                    io.to(`user:${recipe.user_id}`).emit("new-notification", {
                        type: "comment",
                        message: `${comment.user.fullname} commented on your recipe "${recipe.title}"`,
                        recipeId: data.recipeId,
                        fromUser: comment.user,
                        createdAt: new Date()
                    });
                }
            } catch (error) {
                console.error("Error handling new comment:", error);
                socket.emit("error", { message: "Failed to add comment" });
            }
        });

        // Handle recipe rating
        socket.on("rate-recipe", async (data: {
            recipeId: number;
            userId: number;
            rating: number;
        }) => {
            try {
                // Upsert rating
                const rating = await prisma.rating.upsert({
                    where: {
                        user_id_recipe_id: {
                            user_id: data.userId,
                            recipe_id: data.recipeId
                        }
                    },
                    update: {
                        rating: data.rating
                    },
                    create: {
                        user_id: data.userId,
                        recipe_id: data.recipeId,
                        rating: data.rating
                    },
                    include: {
                        user: {
                            select: {
                                fullname: true,
                                username: true
                            }
                        }
                    }
                });

                // Calculate new average rating
                const ratings = await prisma.rating.findMany({
                    where: { recipe_id: data.recipeId },
                    select: { rating: true }
                });

                const averageRating = ratings.length > 0 
                    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
                    : 0;

                // Update recipe average rating
                await prisma.recipe.update({
                    where: { recipe_id: data.recipeId },
                    data: { average_rating: averageRating }
                });

                // Get recipe for notification
                const recipe = await prisma.recipe.findUnique({
                    where: { recipe_id: data.recipeId },
                    select: { user_id: true, title: true }
                });

                // Broadcast rating update to recipe room
                io.to(`recipe:${data.recipeId}`).emit("rating-updated", {
                    recipeId: data.recipeId,
                    averageRating: averageRating,
                    totalRatings: ratings.length
                });

                // Notify recipe owner
                if (recipe && recipe.user_id !== data.userId) {
                    io.to(`user:${recipe.user_id}`).emit("new-notification", {
                        type: "rating",
                        message: `${rating.user.fullname} rated your recipe "${recipe.title}" ${data.rating} stars`,
                        recipeId: data.recipeId,
                        fromUser: rating.user,
                        createdAt: new Date()
                    });
                }
            } catch (error) {
                console.error("Error handling rating:", error);
                socket.emit("error", { message: "Failed to submit rating" });
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}

// Helper function to emit events from API routes
export function getIO(): ServerIO | null {
    return (global as any).io || null;
}