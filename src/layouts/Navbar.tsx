'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { auth } from '@/services/Auth';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { navigationItems } from '@/constants/homepage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellConcierge, faPlus, faPlusCircle, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '@/components/SearchBar';
import Dropdown from '@/components/Dropdown';

export interface NavbarProps {
    userDetails?: {
        id?: string;
        email?: string;
        username?: string;
        fullname?: string;
        profile_image?: string;
    };
}

export default function Navbar({ userDetails }: NavbarProps) {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);

    const profileRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();

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

    const handleSearch = (query: string) => {
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    const handleLogout = () => {
        logoutMutation.mutate();
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
                    {/* Logo */}
                    <Link prefetch href="/" className="flex items-center space-x-1">
                        <Image 
                            src="/savoury-logo.png" 
                            alt="Savoury Logo" 
                            width={65} 
                            height={65}
                            className="drop-shadow-sm"
                        />
                        <span className="text-xl font-bold hidden sm:block text-primary">
                            Savoury
                        </span>
                    </Link>

                    {/* Navigation Section - Conditional based on authentication */}
                    {userDetails ? (
                        <div className="hidden md:flex items-center flex-1 justify-center mx-8 space-x-6">
                            {/* Search Bar */}
                            <SearchBar 
                                onSearch={handleSearch}
                            />
                            {/* Post New Recipe Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >   
                                <Link
                                    href="/new"
                                    className="relative flex flex-col items-center p-2 rounded-lg text-foreground group-hover:text-primary-hover transition-colors group"
                                    aria-label='Post a new recipe'
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} size="xl" className="mb-1" />
                                    <span className='block text-xs font-medium'>
                                        Post
                                    </span>
                                </Link>
                            </motion.div>

                            {/* Notifications Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/notifications"
                                    className="relative flex flex-col items-center p-2 rounded-lg text-foreground group-hover:text-primary-hover transition-colors group"
                                    aria-label="View notifications"
                                >
                                    <FontAwesomeIcon icon={faBell} size="xl" className="mb-1" />
                                    <span className="block text-xs font-medium">
                                        Notifications
                                    </span>
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        // Non-authenticated: Show navigation links
                        <ul className="hidden md:flex items-center space-x-8">
                            {navigationItems.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-foreground hover:text-primary transition-colors font-medium relative group"
                                    >
                                        {label}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden flex flex-col space-y-1.5"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        <span className={`w-6 h-0.5 bg-foreground transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-foreground transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`w-6 h-0.5 bg-foreground transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>

                    {/* Auth Section - Profile or Login/Register */}
                    <section className="hidden md:flex items-center space-x-4">
                        {userDetails ? (
                            // User Profile Dropdown
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
                                            sizes='48x48'
                                            className="object-cover"
                                        />
                                    </div>
                                    <svg
                                        className={`w-6 h-6 text-gray-500 transition-transform ${
                                            showProfileDropdown ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
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
                                            href: `/profile/${userDetails.id}`,
                                            icon: <FontAwesomeIcon icon={faUserCircle} />
                                        },
                                        {
                                            label: logoutMutation.isPending ? 'Logging out...' : 'Log Out',
                                            icon: <FontAwesomeIcon icon={faSignOutAlt} />,
                                            onClick: handleLogout,
                                            variant: 'danger' as const,
                                            disabled: logoutMutation.isPending,
                                        },
                                    ]}
                                />
                            </div>
                        ) : (
                            // Login/Register buttons for non-authenticated users
                            <>
                                <Link 
                                    href="/login" 
                                    className="text-primary hover:text-primary-hover transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link 
                                        href="/register" 
                                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </section>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav 
                            className="md:hidden bg-white border-t border-border mt-2 py-4 px-4 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            aria-label="Mobile navigation"
                        >
                            {userDetails ? (
                                // Authenticated mobile menu - Show SearchBar and profile
                                <>
                                    {/* Mobile Search Bar */}
                                    <div className="mb-4">
                                        <SearchBar 
                                            onSearch={handleSearch}
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
                                                href="/recipes/new"
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
                                                href={`/profile/${userDetails.id}`}
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
                                                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors font-medium py-2"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                <span>Notifications</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="pt-4 border-t border-border">
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleLogout();
                                            }}
                                            disabled={logoutMutation.isPending}
                                            className="flex items-center space-x-3 w-full text-left text-error hover:text-error transition-colors font-medium py-2 disabled:opacity-50"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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