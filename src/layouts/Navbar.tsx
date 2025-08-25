'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { auth } from '@/services/Auth';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export interface NavbarProps {
    userDetails?: {
        profileImage?: string;
        name?: string;
        email?: string;
        role?: string;
        id?: string;
    } | null;
}

export default function Navbar({ userDetails }: NavbarProps) {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

    const profileRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();

    const logoutMutation = useMutation({
        mutationFn: auth.logout,
        onSuccess: () => {
            router.push('/');
            router.prefetch('/');
            router.refresh();
        },
        onError: (error) => {
            console.error(`Logout failed: ${error}`);
        }
    });

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

                    {/* Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-8">
                        <li>
                            <Link 
                                prefetch
                                href="/" 
                                className="text-foreground hover:text-primary transition-colors font-medium relative group"
                            >
                                Home
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/recipes" 
                                className="text-foreground hover:text-primary transition-colors font-medium relative group"
                            >
                                Recipes
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/community" 
                                className="text-foreground hover:text-primary transition-colors font-medium relative group"
                            >
                                Community
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/about" 
                                className="text-foreground hover:text-primary transition-colors font-medium relative group"
                            >
                                About
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        </li>
                    </ul>

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

                    {/* Auth Buttons */}
                    <section className="hidden md:flex items-center space-x-4">
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
                    </section>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.nav 
                        className="md:hidden bg-white border-t border-border mt-2 py-4 px-4 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        aria-label="Mobile navigation"
                    >
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
                    </motion.nav>
                )}
            </nav>
        </motion.header>
	);
}