'use client';

import { navigationItems } from '@/constants/homepage';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
	return (
        <footer className="bg-primary text-white py-16">
            <main className="container mx-auto px-4 lg:px-8">
                <header className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Brand Section */}
                    <section className="space-y-4 md:col-span-1">
                        <header className="flex items-center space-x-2">
                            <h2 className="text-xl font-bold text-white">Savoury</h2>
                        </header>
                        <p className="text-primary-lighter text-sm leading-relaxed">
                            Your modern recipe sharing platform. Discover, create, and share amazing recipes with food lovers worldwide.
                        </p>
                    </section>

                    {/* Quick Links */}
                    <section>
                        <h3 className="font-semibold mb-4 text-white text-lg">Quick Links</h3>
                        <nav className="space-y-3">
                            {navigationItems.map(({ href, label }) => (
                                <motion.div key={href} whileHover={{ x: 5 }}>
                                    <Link 
                                        href={href}
                                        className="text-primary-lighter hover:text-white transition-colors text-sm block"
                                    >
                                        {label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </section>

                    {/* Contact & Social */}
                    <section>
                        <h3 className="font-semibold mb-4 text-white text-lg">Connect</h3>
                        <div className="space-y-4">
                            <address className="text-primary-lighter text-sm not-italic">savoury@gmail.com</address>
                            <div className="flex space-x-3">
                                {['🐦', '📘', '📸', '🎥'].map((emoji, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-base hover:bg-white/20 transition-colors backdrop-blur-sm"
                                    >
                                        {emoji}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </section>
                </header>

                {/* Bottom Bar */}
                <section className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-primary-lighter text-xl order-2 md:order-1 mt-4 md:mt-0">
                        &copy; {new Date().getFullYear()} Savoury. All rights reserved.
                    </p>
                    <nav className="flex space-x-6 order-1 md:order-2">
                        <Link href="/dev" className="text-primary-lighter hover:text-white text-lg transition-colors">
                            About the Developer
                        </Link>
                    </nav>
                </section>
            </main>
        </footer>
	);
}