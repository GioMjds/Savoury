'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinUserRoom: (userId: string) => void;
    joinRecipeRoom: (recipeId: string) => void;
    leaveRecipeRoom: (recipeId: string) => void;
    sendComment: (data: { recipeId: number; userId: number; commentText: string }) => void;
    sendRating: (data: { recipeId: number; userId: number; rating: number }) => void;
    sendLike: (data: { recipeId: number; userId: number; isLiked: boolean }) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    joinUserRoom: () => {},
    joinRecipeRoom: () => {},
    leaveRecipeRoom: () => {},
    sendComment: () => {},
    sendRating: () => {},
    sendLike: () => {},
});

export function SocketManager({ userDetails }: { userDetails?: any }) {
    console.log('🎛️ SocketManager mounted with userDetails:', userDetails?.id);
    const { joinUserRoom, socket, isConnected } = useSocket();

    useEffect(() => {
        console.log('🔄 SocketManager effect triggered:', {
            hasUserDetails: !!userDetails?.id,
            hasSocket: !!socket,
            isConnected
        });

        if (userDetails?.id && socket && isConnected) {
            console.log('🚀 Joining user room for user:', userDetails.id);
            joinUserRoom(userDetails.id);
        }
    }, [userDetails?.id, socket, isConnected, joinUserRoom]);

    return null;
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        console.log('🔌 SocketProvider initializing...');
        
        const socketUrl = process.env.NODE_ENV === 'production' 
            ? process.env.NEXT_PUBLIC_APP_URL || ''
            : 'http://localhost:4000';
            
        console.log('🌐 Connecting to socket server:', socketUrl);
        console.log('🛣️ Socket path: /socket.io');

        const socketInstance = io(socketUrl, {
            path: '/socket.io',
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000,
        });

        socketInstance.on('connect', () => {
            console.log('✅ Connected to socket server with ID:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('❌ Disconnected from socket server. Reason:', reason);
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('💥 Socket connection error:', error);
            setIsConnected(false);
        });

        socketInstance.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected to socket server. Attempt:', attemptNumber);
        });

        socketInstance.on('reconnect_error', (error) => {
            console.error('💥 Socket reconnection error:', error);
        });

        socketInstance.on('error', (error) => {
            console.error('💥 Socket error:', error);
        });

        // Listen for notifications
        socketInstance.on('new-notification', (notification) => {
            console.log('🔔 New notification received:', notification);
        });

        socketInstance.on('notification-removed', (data) => {
            console.log('🗑️ Notification removed:', data);
        });

        socketInstance.on('comment-added', (data) => {
            console.log('💬 New comment added:', data);
        });

        setSocket(socketInstance);

        return () => {
            console.log('🧹 Cleaning up socket connection...');
            socketInstance.disconnect();
        };
    }, []);

    const sendLike = (data: { recipeId: number; userId: number; isLiked: boolean }) => {
        console.log('❤️ Sending like event via socket:', data);
        if (socket && isConnected) {
            socket.emit('like-recipe', data);
            console.log('✅ Like event sent successfully');
        } else {
            console.error('❌ Cannot send like - socket not connected:', {
                hasSocket: !!socket,
                isConnected
            });
        }
    };

    const joinUserRoom = (userId: string) => {
        console.log('👤 Joining user room:', userId);
        if (socket && isConnected) {
            socket.emit('join-user-room', userId);
            console.log('✅ Join user room event sent');
        } else {
            console.error('❌ Cannot join user room - socket not connected:', {
                hasSocket: !!socket,
                isConnected,
                userId
            });
        }
    };

    const joinRecipeRoom = (recipeId: string) => {
        console.log('🍽️ Joining recipe room:', recipeId);
        if (socket && isConnected) {
            socket.emit('join-recipe-room', recipeId);
            console.log('✅ Join recipe room event sent');
        } else {
            console.error('❌ Cannot join recipe room - socket not connected');
        }
    };

    const leaveRecipeRoom = (recipeId: string) => {
        console.log('🚪 Leaving recipe room:', recipeId);
        if (socket && isConnected) {
            socket.emit('leave-recipe-room', recipeId);
            console.log('✅ Leave recipe room event sent');
        } else {
            console.error('❌ Cannot leave recipe room - socket not connected');
        }
    };

    const sendComment = (data: { recipeId: number; userId: number; commentText: string }) => {
        console.log('💬 Sending comment via socket:', data);
        if (socket && isConnected) {
            socket.emit('new-comment', data);
            console.log('✅ Comment event sent successfully');
        } else {
            console.error('❌ Cannot send comment - socket not connected');
        }
    };

    const sendRating = (data: { recipeId: number; userId: number; rating: number }) => {
        console.log('⭐ Sending rating via socket:', data);
        if (socket && isConnected) {
            socket.emit('rate-recipe', data);
            console.log('✅ Rating event sent successfully');
        } else {
            console.error('❌ Cannot send rating - socket not connected');
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            joinUserRoom,
            joinRecipeRoom,
            leaveRecipeRoom,
            sendComment,
            sendRating,
            sendLike,
        }}>
            {children}
        </SocketContext.Provider>
    );
};