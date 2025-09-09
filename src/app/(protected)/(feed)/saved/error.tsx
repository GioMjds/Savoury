'use client';

import { motion } from 'motion/react';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
	return (
		<div className="min-h-screen bg-muted flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
			>
				<div className="text-6xl mb-6">😞</div>
				<h1 className="text-2xl font-bold text-foreground mb-4">
					Something Went Wrong
				</h1>
				<p className="text-muted mb-6">
					We encountered an issue while loading your saved recipes.
				</p>
				<div className="bg-error-light p-4 rounded-lg mb-6">
					<p className="text-error text-sm font-medium">
						{error.message}
					</p>
				</div>
				<button
					onClick={reset}
					className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium"
				>
					Try Again
				</button>
			</motion.div>
		</div>
	);
}
