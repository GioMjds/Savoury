'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { auth } from '@/services/Auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { navigationItems } from '@/constants/homepage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle, faBell } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '@/components/SearchBar';
import Dropdown from '@/components/Dropdown';
import { authenticatedNavbarItems } from '@/constants/navbar';
import { useSocket } from '@/contexts/SocketContext';
import { user } from '@/services/User';
import { toast } from 'react-toastify';

interface NavbarProps {
    userDetails?: {
        id?: string;
        email?: string;
        username?: string;
        fullname?: string;
        profile_image?: string;
    };
}

interface Notification {
    notification_id: number;
    type: string;
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

export default function Navbar({ userDetails }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const profileRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: notificationsData } = useQuery({
        queryKey: ['notifications', userDetails?.id],
        queryFn: () => user.fetchNotifications({ page: 1, limit: 1, userId: userDetails?.id ? parseInt(userDetails.id) : null }),
        enabled: !!userDetails?.id,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (notificationsData?.unreadCount !== undefined) {
            setUnreadCount(notificationsData.unreadCount);
        }
    }, [notificationsData]);

    useEffect(() => {
        if (!userDetails?.id) return;

        const currentUserId = parseInt(userDetails.id);

        const handleNewNotification = (notification: Notification) => {
            console.log('🔔 New notification received in Navbar:', notification);
            if (notification.recipient_id && notification.recipient_id === currentUserId) {
                setUnreadCount(prev => prev + 1);
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
            } else {
                console.log('🚫 Ignoring notification not meant for current user');
            }
        };

        const handleNotificationRemoved = (data: { type: string; recipeId: number; senderId: number; recipientId?: number }) => {
            if (!data.recipientId || data.recipientId === currentUserId) {
                setUnreadCount(prev => Math.max(0, prev - 1));
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
            }
        };

        const handleCustomNewNotification = (event: CustomEvent) => {
            handleNewNotification(event.detail);
        };

        const handleCustomNotificationRemoved = (event: CustomEvent) => {
            handleNotificationRemoved(event.detail);
        };

        window.addEventListener('new-notification', handleCustomNewNotification as EventListener);
        window.addEventListener('notification-removed', handleCustomNotificationRemoved as EventListener);

        return () => {
            // socket.off('new-notification', handleNewNotification);
            // socket.off('notification-removed', handleNotificationRemoved);
            window.removeEventListener('new-notification', handleCustomNewNotification as EventListener);
            window.removeEventListener('notification-removed', handleCustomNotificationRemoved as EventListener);
        };
    }, [userDetails?.id, queryClient]);

    const logoutMutation = useMutation({
        mutationFn: () => auth.logout(''),
        onSuccess: () => {
            setShowProfileDropdown(false);
            router.push('/');
            router.prefetch('/');
            router.refresh();
        },
        onError: (error) => {
            console.error(`Logout failed: ${error}`);
        }
    });

    const handleNotificationClick = () => {
        // Don't reset count here - let the notifications page handle it
        // The count will be updated when notifications are marked as read
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.header 
            className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <nav className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Search (for authenticated users) */}
                    <div className="flex items-center space-x-4">
                        <Link prefetch href="/" className="flex items-center space-x-1">
                            <Image 
                                src="/savoury-logo.png" 
                                alt="Savoury Logo" 
                                width={65} 
                                height={65}
                                priority
                                className="drop-shadow-sm"
                            />
                            <span className="text-xl font-bold hidden sm:block text-primary">
                                Savoury
                            </span>
                        </Link>

                        {userDetails && (
                            <div className="hidden md:block w-80">
                                <SearchBar 
                                    placeholder='Search for recipes, ingredients, or Savoury users...'
                                />
                            </div>
                        )}
                    </div>

                    {/* Navigation Section - Conditional based on authentication */}
                    {userDetails ? (
                        <div className="flex items-center space-x-2">
                            {authenticatedNavbarItems.map(({ href, label, icon, ariaLabel }) => (
                                <motion.div
                                    key={href}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href={href}
                                        onClick={href === '/notifications' ? handleNotificationClick : undefined}
                                        className="relative flex flex-col justify-center items-center p-2 text-foreground group-hover:text-primary-hover transition-colors group"
                                        aria-label={ariaLabel}
                                    >
                                        <div className="relative">
                                            <FontAwesomeIcon icon={icon} size="xl" className="mb-1" />
                                            {href === '/notifications' && unreadCount > 0 && (
                                                <motion.div
                                                    key={unreadCount}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse"
                                                >
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </motion.div>
                                            )}
                                        </div>
                                        <span className='block text-xs font-medium'>
                                            {label}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                            
                            {/* Profile Section */}
                            <div className="relative" ref={profileRef}>
                                <motion.button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center cursor-pointer space-x-2 p-1 rounded-full hover:bg-accent transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                                        <Image
                                            src={userDetails.profile_image as string}
                                            alt={userDetails.fullname as string}
                                            fill
                                            loading='lazy'
                                            sizes='48x48'
                                            className="object-cover"
                                        />
                                    </div>
                                </motion.button>

                                {/* Profile Dropdown */}
                                <Dropdown
                                    userDetails={userDetails}
                                    isOpen={showProfileDropdown}
                                    onToggle={() => setShowProfileDropdown(!showProfileDropdown)}
                                    onClose={() => setShowProfileDropdown(false)}
                                    options={[
                                        {
                                            label: 'View Profile',
                                            href: `/user/${userDetails.username}`,
                                            icon: <FontAwesomeIcon icon={faUserCircle} />
                                        },
                                        {
                                            label: logoutMutation.isPending ? 'Logging out...' : 'Log Out',
                                            icon: <FontAwesomeIcon icon={faSignOutAlt} />,
                                            onClick: logoutMutation.mutate,
                                            variant: 'danger',
                                            disabled: logoutMutation.isPending,
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    ) : (
                        // Non-authenticated: Show navigation links
                        <motion.ul 
                            className="hidden md:flex items-center space-x-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {navigationItems.map(({ href, label }, index) => (
                                <motion.li 
                                    key={href}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                                    whileHover={{ y: -2 }}
                                >
                                    <Link
                                        href={href}
                                        className="relative text-foreground hover:text-primary transition-all duration-300 font-medium group px-2 py-1"
                                    >
                                        {label}
                                        <motion.span 
                                            className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        />
                                    </Link>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}

                    {/* Mobile Menu Button */}
                    <motion.button 
                        className="md:hidden flex flex-col space-y-1.5 p-2 rounded-lg hover:bg-accent transition-colors duration-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.span 
                            className="w-6 h-0.5 bg-foreground rounded-full"
                            animate={{
                                rotate: isMenuOpen ? 45 : 0,
                                y: isMenuOpen ? 8 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                        <motion.span 
                            className="w-6 h-0.5 bg-foreground rounded-full"
                            animate={{
                                opacity: isMenuOpen ? 0 : 1,
                                x: isMenuOpen ? 20 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                        <motion.span 
                            className="w-6 h-0.5 bg-foreground rounded-full"
                            animate={{
                                rotate: isMenuOpen ? -45 : 0,
                                y: isMenuOpen ? -8 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                    </motion.button>

                    {/* Auth Section for non-authenticated users */}
                    {!userDetails && (
                        <motion.div
                            className="hidden md:flex items-center space-x-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link 
                                    href="/login" 
                                    className="text-primary hover:text-primary-hover transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
                                >
                                    Login
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Link 
                                    href="/register" 
                                    className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform"
                                >
                                    Register
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav 
                            className="md:hidden bg-white/95 backdrop-blur-md border-t border-border mt-2 py-6 px-4 rounded-xl shadow-xl mx-2"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            aria-label="Mobile navigation"
                        >
                            {userDetails ? (
                                <>
                                    {/* Mobile Search Bar */}
                                    <div className="mb-4">
                                        <SearchBar 
                                            placeholder='Search for recipes, ingredients, or Savoury users...'
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3 pb-4 border-b border-border">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                                            <Image
                                                src={userDetails.profile_image || '/Default_pfp.jpg'}
                                                alt={userDetails.fullname || 'User'}
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {userDetails.fullname}
                                            </p>
                                            <p className="text-xs text-muted">
                                                @{userDetails.username}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="flex flex-col space-y-4 py-4">
                                        <li>
                                            <Link 
                                                href="/new"
                                                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors font-medium py-2"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span>Post New Recipe</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href={`/user/${userDetails.username}`}
                                                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors font-medium py-2"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>View Profile</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="/feed" 
                                                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors font-medium py-2"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                </svg>
                                                <span>My Feed</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="/notifications" 
                                                className="flex items-center justify-between text-foreground hover:text-primary transition-colors font-medium py-2"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    handleNotificationClick();
                                                }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                                                    <span>Notifications</span>
                                                </div>
                                                {unreadCount > 0 && (
                                                    <motion.div
                                                        key={unreadCount}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse"
                                                    >
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </motion.div>
                                                )}
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="pt-4 border-t border-border">
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                logoutMutation.mutate();
                                            }}
                                            disabled={logoutMutation.isPending}
                                            className="flex items-center space-x-3 w-full text-left text-error hover:text-error transition-colors font-medium py-2 disabled:opacity-50"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>{logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Non-authenticated mobile menu - Show navigation links
                                <>
                                    <ul className="flex flex-col space-y-4">
                                        {navigationItems.map(({ href, label }) => (
                                            <li key={href}>
                                                <Link 
                                                    href={href} 
                                                    className="text-foreground hover:text-primary transition-colors font-medium py-3 block border-b border-border last:border-b-0"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <section className="pt-6 border-t border-border flex flex-col space-y-4">
                                        <Link 
                                            href="/login" 
                                            className="text-primary text-center hover:text-primary-hover transition-colors font-medium py-2 px-4 border border-primary rounded-lg hover:bg-primary-lighter"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link 
                                            href="/register" 
                                            className="bg-primary hover:bg-primary-hover text-white text-center px-4 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </section>
                                </>
                            )}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}