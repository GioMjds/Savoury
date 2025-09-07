'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { featuresContent } from '@/constants/homepage';
import Link from 'next/link';

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { y: 50, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring' as const,
			stiffness: 80,
			damping: 12,
		},
	},
};

const floatingVariants = {
	animate: {
		y: [-10, 10, -10],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: 'easeInOut' as const,
		},
	},
};

export default function Home() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<motion.section
				className="relative overflow-hidden bg-gradient-to-br from-white via-muted to-primary-lighter min-h-screen flex items-center"
				initial="hidden"
				animate="visible"
				variants={containerVariants}
			>
				<div className="container mx-auto px-12 lg:px-20 py-12 sm:py-28">
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						{/* Left Content */}
						<motion.div
							variants={itemVariants}
							className="space-y-4"
						>
							<motion.div
								variants={itemVariants}
								className="inline-flex items-center bg-primary-light text-foreground px-4 py-2 rounded-full text-sm font-medium"
							>
								🍳 Your Modern Recipe Platform
							</motion.div>

							<motion.h1
								variants={itemVariants}
								className="text-5xl lg:text-7xl font-bold leading-tight text-foreground"
							>
								Unlock Your{' '}
								<span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
									Flavor
								</span>
							</motion.h1>

							<motion.p
								variants={itemVariants}
								className="text-xl text-muted leading-relaxed"
							>
								Discover, create, and share amazing recipes with a community of food lovers. Transform your cooking journey with Savoury.
							</motion.p>

							<motion.div
								variants={itemVariants}
								className="flex flex-col sm:flex-row gap-4"
							>
								<Link
									href="/register"
									className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
								>
									Join Savoury for Free
								</Link>
								<Link
									href="/login"
									className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium text-lg transition-all duration-200"
								>
									Sign In & Explore
								</Link>
							</motion.div>
						</motion.div>

						{/* Right Content - Logo */}
						<motion.div
							variants={floatingVariants}
							animate="animate"
							className="flex justify-center lg:justify-end"
						>
							<div className="relative">
								<motion.div
									className="absolute -inset-4 bg-gradient-to-r from-primary to-primary-hover rounded-full opacity-20 blur-2xl"
									animate={{
										scale: [1, 1.1, 1],
										rotate: [0, 5, -5, 0],
									}}
									transition={{
										duration: 8,
										repeat: Infinity,
										ease: 'easeInOut' as const,
									}}
								/>
								<Image
									src="/savoury-logo.png"
									alt="Savoury Logo"
									width={400}
									height={400}
									className="relative z-10 drop-shadow-2xl"
									priority
								/>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Decorative Elements */}
				<motion.div
					className="absolute top-20 right-20 w-20 h-20 rounded-full bg-primary-light/60"
					animate={{
						scale: [1, 1.2, 1],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'linear' as const,
					}}
				/>
				<motion.div
					className="absolute bottom-32 left-16 w-16 h-16 rounded-full bg-primary/40"
					animate={{
						x: [0, 30, 0],
						y: [0, -20, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut' as const,
					}}
				/>
			</motion.section>

			{/* Features Section */}
			<motion.section
				className="py-20 bg-white"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: '-100px' }}
				variants={containerVariants}
			>
				<div className="container mx-auto px-4 lg:px-8">
					<motion.div
						variants={itemVariants}
						className="text-center mb-16"
					>
						<h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
							Why Choose Savoury?
						</h2>
						<p className="text-xl text-muted mx-auto">
							Join thousands of home cooks and professional chefs, sharing their culinary creations
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{featuresContent.map((feature, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className="text-center p-8 rounded-xl bg-muted hover:bg-white border-2 border-transparent hover:border-primary-light transition-all duration-300 group"
								whileHover={{ y: -8 }}
							>
								<motion.div
									className="text-4xl mb-4"
									whileHover={{ scale: 1.2, rotate: 10 }}
									transition={{
										type: 'spring' as const,
										stiffness: 300,
									}}
								>
									{feature.icon}
								</motion.div>
								<h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
									{feature.title}
								</h3>
								<p className="text-muted leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* CTA Section */}
			<motion.section
				className="py-20 bg-gradient-to-r from-primary to-primary-hover text-white relative overflow-hidden"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				variants={containerVariants}
			>
				<div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
					<motion.h2
						variants={itemVariants}
						className="text-4xl lg:text-5xl font-bold mb-6"
					>
						Ready to Start Your Culinary Journey?
					</motion.h2>
					<motion.p
						variants={itemVariants}
						className="text-xl mb-8 opacity-90 mx-auto"
					>
						Join our community today and discover your next favorite recipe
					</motion.p>
					<motion.div variants={itemVariants}>
						<Link
							href='/register'
							className="px-10 py-4 bg-white text-primary rounded-lg font-medium text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg"
						>
							Get Started Now
						</Link>
					</motion.div>
				</div>

				{/* Background Pattern */}
				<motion.div
					className="absolute inset-0 opacity-10"
					animate={{
						backgroundPosition: ['0% 0%', '100% 100%'],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						repeatType: 'reverse' as const,
						ease: 'linear' as const,
					}}
					style={{
						backgroundImage:
							'radial-gradient(circle, white 1px, transparent 1px)',
						backgroundSize: '50px 50px',
					}}
				/>
			</motion.section>
		</div>
	);
}
