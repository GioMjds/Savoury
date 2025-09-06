'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
	faCheckCircle,
	faHeart,
	faComment,
	faUserPlus,
	faBookmark,
	faShare,
} from '@fortawesome/free-solid-svg-icons';
import { formatTimeAgo } from '@/utils/formaters';
import { user } from '@/services/User';

const notificationTypes = {
	like: { icon: faHeart, color: 'text-error' },
	comment: { icon: faComment, color: 'text-info' },
	follow: { icon: faUserPlus, color: 'text-warning' },
	save: { icon: faBookmark, color: 'text-success' },
	share: { icon: faShare, color: 'text-primary' },
	default: { icon: faBell, color: 'text-primary' },
};

export default function NotifPage() {
	const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
	const { data, refetch } = useQuery({
		queryKey: ['notifications', 1],
		queryFn: () => user.fetchNotifications({ page: 1, limit: 20 }),
	});

	const handleMarkAsRead = async (notificationId: number) => {
		try {
			await user.markNotificationAsRead(notificationId);
			refetch();
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await user.markAllNotificationsAsRead();
			refetch();
		} catch (error) {
			console.error('Failed to mark all notifications as read:', error);
		}
	};

	const filteredNotifications = activeTab === 'unread'
			? data?.notifications.filter((notification: any) => !notification.is_read)
			: data?.notifications;

	return (
		<div className="min-h-screen w-6xl container mx-auto p-6 pt-20">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-foreground">
					Notifications
				</h1>

				<div className="flex items-center gap-2">
					{data.unreadCount > 0 && (
						<button
							onClick={handleMarkAllAsRead}
							className="text-sm bg-primary-light text-foreground px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
						>
							Mark all as read
						</button>
					)}
					<span className="bg-primary text-button-primary-text text-sm px-2 py-1 rounded-full">
						{data?.unreadCount || 0} unread
					</span>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-border mb-6">
				<button
					className={`px-4 py-2 font-medium ${
						activeTab === 'all'
							? 'text-primary border-b-2 border-primary'
							: 'text-muted'
					}`}
					onClick={() => setActiveTab('all')}
				>
					All
				</button>
				<button
					className={`px-4 py-2 font-medium ${
						activeTab === 'unread'
							? 'text-primary border-b-2 border-primary'
							: 'text-muted'
					}`}
					onClick={() => setActiveTab('unread')}
				>
					Unread
				</button>
			</div>

			{/* Notifications List */}
			{filteredNotifications && filteredNotifications.length > 0 ? (
				<motion.div
					className="space-y-3"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: {
								staggerChildren: 0.05,
							},
						},
					}}
				>
					<AnimatePresence>
						{filteredNotifications.map((notification: any) => {
							const notificationType =
								notificationTypes[notification.type as keyof typeof notificationTypes] || notificationTypes.default;

							return (
								<motion.div
									key={notification.notification_id}
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.2 }}
									className={`bg-background border border-border rounded-xl p-4 ${
										!notification.is_read ? 'bg-muted' : ''
									}`}
								>
									<div className="flex gap-3">
										{/* Icon */}
										<div className={`p-3 rounded-full ${notificationType.color} bg-opacity-20 flex items-center justify-center`}>
											<FontAwesomeIcon
												icon={notificationType.icon}
												className="h-5 w-5"
											/>
										</div>

										{/* Content */}
										<div className="flex-1">
											<div className="flex justify-between items-start">
												<p className="text-foreground">
													{notification.message}
												</p>

												{!notification.is_read && (
													<button
														onClick={() => handleMarkAsRead(notification.notification_id)}
														className="text-primary hover:text-primary-hover ml-2"
														title="Mark as read"
													>
														<FontAwesomeIcon
															icon={faCheckCircle}
															className="h-5 w-5"
														/>
													</button>
												)}
											</div>

											<div className="flex items-center justify-between mt-2">
												<span className="text-xs text-muted">
													{formatTimeAgo(notification.created_at)}
												</span>

												{notification.recipe?.image_url && (
													<div className="h-10 w-10 rounded-md overflow-hidden">
														<Image
															src={notification.recipe.image_url}
															alt={notification.recipe.title}
															width={40}
                                                            height={40}
                                                            loading="lazy"
                                                            className="object-cover"
														/>
													</div>
												)}
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</motion.div>
			) : (
				<div className="text-center py-12">
					<div className="bg-muted p-4 rounded-xl inline-block mb-4">
						<FontAwesomeIcon
							icon={faBell}
							className="h-8 w-8 text-muted"
						/>
					</div>
					<h2 className="text-xl font-semibold mb-2">
						No notifications yet
					</h2>
					<p className="text-muted">
						{activeTab === 'unread'
							? "You don't have any unread notifications."
							: 'Your notifications will appear here.'}
					</p>
				</div>
			)}
		</div>
	);
}
