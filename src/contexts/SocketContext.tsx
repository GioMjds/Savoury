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
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    joinUserRoom: () => {},
    joinRecipeRoom: () => {},
    leaveRecipeRoom: () => {},
    sendComment: () => {},
    sendRating: () => {},
});

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
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(process.env.NODE_ENV === 'production' 
            ? process.env.NEXT_PUBLIC_APP_URL || ''
            : 'http://localhost:3000', {
            path: '/api/socket/io',
        });

        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsConnected(false);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinUserRoom = (userId: string) => {
        socket?.emit('join-user-room', userId);
    };

    const joinRecipeRoom = (recipeId: string) => {
        socket?.emit('join-recipe-room', recipeId);
    };

    const leaveRecipeRoom = (recipeId: string) => {
        socket?.emit('leave-recipe-room', recipeId);
    };

    const sendComment = (data: { recipeId: number; userId: number; commentText: string }) => {
        socket?.emit('new-comment', data);
    };

    const sendRating = (data: { recipeId: number; userId: number; rating: number }) => {
        socket?.emit('rate-recipe', data);
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
        }}>
            {children}
        </SocketContext.Provider>
    );
};