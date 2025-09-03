import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const port = process.env.SOCKET_PORT || 4000;
const prisma = new PrismaClient();

const httpServer = createServer();
const io = new Server(httpServer, {
    path: '/socket.io',
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? process.env.NEXTAUTH_URL
            : 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    }
});

console.log('🚀 Socket.IO server starting...');

io.on('connection', (socket) => {
    console.log('🎯 New client connected:', socket.id);
    console.log('📊 Total connected clients:', io.engine.clientsCount);

    socket.on('join-user-room', (userId) => {
        socket.join(`user:${userId}`);
        console.log(`👤 User ${userId} joined their personal room (socket: ${socket.id})`);
    });

    socket.on('join-recipe-room', (recipeId) => {
        socket.join(`recipe:${recipeId}`);
        console.log(`🍽️ User joined recipe room: ${recipeId} (socket: ${socket.id})`);
    });

    socket.on('leave-recipe-room', (recipeId) => {
        socket.leave(`recipe:${recipeId}`);
        console.log(`🚪 User left recipe room: ${recipeId} (socket: ${socket.id})`);
    });

    socket.on('like-recipe', async (data) => {
        console.log('🚨 LIKE EVENT RECEIVED!');
        console.log('❤️ Like event data:', JSON.stringify(data, null, 2));
        console.log('🔍 From socket:', socket.id);
        console.log('⏰ Timestamp:', new Date().toISOString());
        
        try {
            console.log('🔎 Searching for recipe with ID:', data.recipeId);
            const recipe = await prisma.recipe.findUnique({
                where: { recipe_id: data.recipeId },
                select: {
                    user_id: true,
                    title: true,
                    user: {
                        select: {
                            fullname: true,
                            username: true,
                            profile_image: true,
                        }
                    }
                }
            });
            
            console.log('📋 Recipe found:', recipe ? 'YES' : 'NO');
            if (recipe) {
                console.log('👤 Recipe owner ID:', recipe.user_id);
                console.log('📝 Recipe title:', recipe.title);
            }
            
            if (!recipe) {
                console.log('❌ Recipe not found, exiting...');
                return;
            }
            
            if (recipe.user_id === data.userId) {
                console.log('⚠️ User is liking their own recipe, skipping notification...');
                return;
            }
            
            if (data.isLiked) {
                console.log('💖 Creating like notification...');
                const sender = await prisma.users.findUnique({
                    where: { user_id: data.userId },
                    select: {
                        fullname: true,
                        username: true,
                        profile_image: true,
                    }
                });
                
                console.log('👥 Sender found:', sender ? 'YES' : 'NO');
                if (sender) {
                    console.log('👤 Sender name:', sender.fullname);
                }
                
                if (!sender) {
                    console.log('❌ Sender not found, exiting...');
                    return;
                }
                
                console.log('💾 Creating notification in database...');
                const notification = await prisma.notification.create({
                    data: {
                        recipient_id: recipe.user_id,
                        sender_id: data.userId,
                        recipe_id: data.recipeId,
                        type: 'like',
                        message: `${sender.fullname} liked your recipe "${recipe.title}"`,
                    },
                    include: {
                        sender: true,
                        recipe: true
                    }
                });
                
                console.log('✅ Notification created with ID:', notification.notification_id);
                console.log('📡 Emitting to room:', `user:${recipe.user_id}`);
                io.to(`user:${recipe.user_id}`).emit('new-notification', notification);
                console.log('📤 Notification emitted successfully');
            } else {
                console.log('💔 Removing like notification...');
                const deletedCount = await prisma.notification.deleteMany({
                    where: {
                        recipient_id: recipe.user_id,
                        sender_id: data.userId,
                        recipe_id: data.recipeId,
                        type: 'like'
                    }
                });
                console.log('🗑️ Deleted notifications count:', deletedCount.count);
                
                console.log('📡 Emitting removal to room:', `user:${recipe.user_id}`);
                io.to(`user:${recipe.user_id}`).emit('notification-removed', {
                    type: 'like',
                    recipeId: data.recipeId,
                    senderId: data.userId
                });
                console.log('📤 Notification removal emitted successfully');
            }
        } catch (error) {
            console.error('💥 Error handling like event:', error);
            console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        }
    });

    socket.on('disconnect', () => {
        console.log(`👋 User disconnected: ${socket.id}`);
    });
});

httpServer.listen(port, () => {
    console.log(`✅ Socket.IO server running on port ${port}`);
});
