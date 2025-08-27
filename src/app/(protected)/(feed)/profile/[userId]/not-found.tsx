'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-border rounded-xl shadow-lg p-8 max-w-max mx-auto w-full text-center"
            >
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-muted mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold mb-2 text-muted">User Not Found</h2>
                <p className="text-muted mb-6">Sorry, we couldn't find the user you're looking for.</p>
                <Link prefetch href="/feed" className="inline-block bg-primary text-white px-4 py-2 rounded-md shadow focus-ring hover:bg-[var(--color-primary-hover)] transition">
                    Go Home
                </Link>
            </motion.div>
        </div>
    );
}