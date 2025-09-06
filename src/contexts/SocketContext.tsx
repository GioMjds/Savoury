'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface LikeUpdateData {
	recipeId: number;
	userId: number;
	isLiked: boolean;
	newLikeCount: number;
	userInfo: {
		user_id: number;
		fullname: string;
		username: string;
		profile_image: string;
	};
}

interface NotificationData {
	notification_id: number;
	type: 'like' | 'comment' | 'follow';
	message: string;
	is_read: boolean;
	created_at: string;
	recipient_id?: number; // Add recipient_id to track who should receive this notification
	sender: {
		user_id: number;
		fullname: string;
		username: string;
		profile_image: string;
	};
	recipe?: {
		recipe_id: number;
		title: string;
		image_url: string;
	};
}

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	sendLike: (data: {
		recipeId: number;
		userId: number;
		isLiked: boolean;
		newLikeCount: number;
		userInfo: {
			user_id: number;
			fullname: string;
			username: string;
			profile_image: string;
		};
	}) => void;
	sendNotification: (notification: NotificationData) => void;
	removeNotification: (data: { type: string; recipeId: number; senderId: number; recipientId?: number }) => void;
	sendComment: (data: {
		recipeId: number;
		userId: number;
		comment: string;
	}) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const eventEmitter = {
			connected: true,
			listeners: new Map<string, Function[]>(),
			
			emit(event: string, data: any) {
				console.log(`🔌 Broadcasting event: ${event}`, data);
				
				// Broadcast to all components listening for this event
				const listeners = this.listeners.get(event) || [];
				listeners.forEach((listener: Function) => {
					try {
						listener(data);
					} catch (error) {
						console.error(`Error in event listener for ${event}:`, error);
					}
				});
				
				// Also dispatch as window event for backward compatibility
				window.dispatchEvent(new CustomEvent(event, { detail: data }));
			},
			
			on(event: string, handler: Function) {
				console.log(`🔌 Registering listener for: ${event}`);
				
				if (!this.listeners.has(event)) {
					this.listeners.set(event, []);
				}
				this.listeners.get(event)!.push(handler);
				
				// Also listen to window events
				const windowHandler = (e: any) => handler(e.detail);
				window.addEventListener(event, windowHandler);
				
				// Store window handler for cleanup
				(handler as any)._windowHandler = windowHandler;
			},
			
			off(event: string, handler: Function) {
				console.log(`🔌 Removing listener for: ${event}`);
				
				const listeners = this.listeners.get(event);
				if (listeners) {
					const index = listeners.indexOf(handler);
					if (index > -1) {
						listeners.splice(index, 1);
					}
					
					if (listeners.length === 0) {
						this.listeners.delete(event);
					}
				}
				
				// Remove window event listener
				if ((handler as any)._windowHandler) {
					window.removeEventListener(event, (handler as any)._windowHandler);
					delete (handler as any)._windowHandler;
				}
			}
		} as any as Socket;

		setSocket(eventEmitter);
		setIsConnected(true);

		return () => {
			(eventEmitter as any).listeners.clear();
			setIsConnected(false);
			setSocket(null);
		};
	}, []);

	const sendLike = (data: LikeUpdateData) => {
		if (socket?.connected) {
			console.log('👍 Broadcasting like update:', data);
			socket.emit('like-update', data);
		} else {
			console.warn('⚠️ Socket not connected, cannot send like update');
		}
	};

	const sendNotification = (notification: NotificationData) => {
		if (socket?.connected) {
			console.log('🔔 Broadcasting new notification:', notification);
			socket.emit('new-notification', notification);
		} else {
			console.warn('⚠️ Socket not connected, cannot send notification');
		}
	};

	const removeNotification = (data: { type: string; recipeId: number; senderId: number; recipientId?: number }) => {
		if (socket?.connected) {
			console.log('�️ Broadcasting notification removal:', data);
			socket.emit('notification-removed', data);
		} else {
			console.warn('⚠️ Socket not connected, cannot remove notification');
		}
	};

	const sendComment = (data: {
		recipeId: number;
		userId: number;
		comment: string;
	}) => {
		if (socket?.connected) {
			console.log('💬 Sending comment event:', data);
			socket.emit('comment', data);
		} else {
			console.warn('⚠️ Socket not connected, cannot send comment');
		}
	};

	return (
		<SocketContext.Provider
			value={{ 
				socket, 
				isConnected, 
				sendLike, 
				sendNotification,
				removeNotification,
				sendComment 
			}}
		>
			{children}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	return useContext(SocketContext);
}
