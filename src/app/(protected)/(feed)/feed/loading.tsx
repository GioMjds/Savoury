'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'motion/react';

const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring' as const,
			stiffness: 100,
			damping: 15,
			duration: 0.6,
		},
	},
};

export default function Loading() {
	return (
		<div className="min-h-screen bg-background pt-20 pb-8">
			<div className="container mx-auto px-4 lg:px-8">
				{/* Loading Header */}
				<motion.div
					className="text-center mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center justify-center space-x-3 mb-4">
						<motion.div
							animate={{
								rotate: 360,
								scale: [1, 1.1, 1],
							}}
							transition={{
								rotate: {
									duration: 2,
									repeat: Infinity,
									ease: 'linear',
								},
								scale: {
									duration: 1,
									repeat: Infinity,
									ease: 'easeInOut',
								},
							}}
							className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
						>
							🍳
						</motion.div>
						<h1 className="text-2xl font-bold text-foreground">
							Loading Your Feed
						</h1>
					</div>
					<motion.p
						className="text-muted text-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					>
						Fetching the latest recipes from your favorite creators...
					</motion.p>
				</motion.div>

				{/* Recipe Cards Grid */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{skeletonCards.map((index) => (
						<motion.div
							key={index}
							variants={cardVariants}
							className="bg-white rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
						>
							{/* Recipe Image Skeleton */}
							<div className="relative h-48 bg-gray-100">
								<Skeleton
									height="100%"
									width="100%"
									baseColor="#f3f4f6"
									highlightColor="#e5e7eb"
									className="absolute inset-0"
								/>
								{/* Floating category badge */}
								<div className="absolute top-3 left-3">
									<Skeleton
										width={80}
										height={24}
										borderRadius={12}
										baseColor="#ffffff"
										highlightColor="#f9fafb"
									/>
								</div>
							</div>

							{/* Card Content */}
							<div className="p-4 space-y-4">
								{/* Recipe Title */}
								<div>
									<Skeleton
										height={24}
										width="85%"
										baseColor="#f3f4f6"
										highlightColor="#e5e7eb"
									/>
								</div>

								{/* Recipe Description */}
								<div className="space-y-2">
									<Skeleton
										height={16}
										width="100%"
										baseColor="#f9fafb"
										highlightColor="#f3f4f6"
									/>
									<Skeleton
										height={16}
										width="70%"
										baseColor="#f9fafb"
										highlightColor="#f3f4f6"
									/>
								</div>

								{/* Recipe Meta Info (Time, Servings) */}
								<div className="flex items-center space-x-4 text-sm">
									<div className="flex items-center space-x-1">
										<Skeleton
											circle
											width={16}
											height={16}
											baseColor="#f3f4f6"
											highlightColor="#e5e7eb"
										/>
										<Skeleton
											width={60}
											height={16}
											baseColor="#f9fafb"
											highlightColor="#f3f4f6"
										/>
									</div>
									<div className="flex items-center space-x-1">
										<Skeleton
											circle
											width={16}
											height={16}
											baseColor="#f3f4f6"
											highlightColor="#e5e7eb"
										/>
										<Skeleton
											width={80}
											height={16}
											baseColor="#f9fafb"
											highlightColor="#f3f4f6"
										/>
									</div>
								</div>

								{/* Author Info */}
								<div className="flex items-center space-x-3 pt-3 border-t border-border">
									<Skeleton
										circle
										width={32}
										height={32}
										baseColor="#f3f4f6"
										highlightColor="#e5e7eb"
									/>
									<div className="flex-1">
										<Skeleton
											width={100}
											height={14}
											baseColor="#f9fafb"
											highlightColor="#f3f4f6"
										/>
										<Skeleton
											width={80}
											height={12}
											baseColor="#f9fafb"
											highlightColor="#f3f4f6"
											className="mt-1"
										/>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Loading Tips */}
				<motion.div
					className="mt-12 text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.5 }}
				>
					<div className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm">
						<motion.div
							animate={{ scale: [1, 1.2, 1] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						>
							💡
						</motion.div>
						<span className="font-medium">
							Tip: Follow your favorite creators to see more
							recipes in your feed!
						</span>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
