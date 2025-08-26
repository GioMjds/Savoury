'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { auth } from '@/services/Auth';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import Dropdown from '@/components/Dropdown';
import { navigationItems } from '@/constants/homepage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faDoorOpen, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

export interface NavbarProps {
    userDetails?: {
        id?: string;
        email?: string;
        username?: string;
        fullname?: string;
        profile_image?: string;
    } | null;
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
                    <Link prefetch href="/" className="flex items-center space-x-2">
                        <Image 
                            src="/savoury-logo.png" 
                            alt="Savoury Logo" 
                            width={40} 
                            height={40}
                            className="drop-shadow-sm"
                        />
                        <span className="text-xl font-bold hidden sm:block text-primary">
                            Savoury
                        </span>
                    </Link>

                    {/* Navigation Section - Conditional based on authentication */}
                    {userDetails ? (
                        // Authenticated: Show SearchBar
                        <div className="hidden md:flex items-center flex-1 justify-center mx-8">
                            <SearchBar 
                                onSearch={handleSearch}
                            />
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
                                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-accent transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                                        <Image
                                            src={userDetails.profile_image as string}
                                            alt={userDetails.fullname as string}
                                            fill
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
                                            label: 'Settings',
                                            href: '/settings',
                                            icon: <FontAwesomeIcon icon={faCog} />
                                        },
                                        {
                                            label: logoutMutation.isPending ? 'Signing out...' : 'Sign Out',
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
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {userDetails.fullname}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                @{userDetails.username}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="flex flex-col space-y-4 py-4">
                                        <li>
                                            <Link 
                                                href={`/profile/${userDetails.id}`}
                                                className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                View Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="/feed" 
                                                className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                My Feed
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="/settings" 
                                                className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Settings
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
                                            className="w-full text-left text-error hover:text-error font-medium py-2 disabled:opacity-50"
                                        >
                                            {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Non-authenticated mobile menu - Show navigation links
                                <>
                                    <ul className="flex flex-col space-y-4">
                                        <li>
                                            <Link 
                                                href="/" 
                                                className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="/recipes" 
                                                className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Recipes
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="/community" 
                                                className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Community
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="/about" 
                                                className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                About
                                            </Link>
                                        </li>
                                    </ul>
                                    <section className="pt-4 border-t border-border flex flex-col space-y-3">
                                        <Link 
                                            href="/login" 
                                            className="text-primary text-center hover:text-primary-hover transition-colors font-medium py-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link 
                                            href="/register" 
                                            className="bg-primary hover:bg-primary-hover text-white text-center px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
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