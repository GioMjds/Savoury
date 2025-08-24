'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faEye,
	faEyeSlash,
	faStar,
	faUsers,
	faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { auth } from '@/services/Auth';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginPayload } from '@/types/AuthResponse';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const formVariants = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};

export default function LoginPage() {
	const [passwordShow, setPasswordShow] = useState<boolean>(false);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<LoginPayload>({
		mode: 'onBlur',
	});

	const loginMutation = useMutation({
		mutationFn: (payload: LoginPayload) => auth.login(payload),
		onSuccess: () => {
			router.push('/');
		},
		onError: (error: Error) => {
			const msg = error.message || 'Login failed. Please try again.';
			const noUser = msg.includes('No user found');
			const emptyFields = msg.includes(
				'Email or username and password are required.'
			);
			const passwordInvalid = msg.includes('Invalid password');

			if (noUser || emptyFields) {
				setError('identifier', { type: 'manual', message: msg });
			} else if (passwordInvalid) {
				setError('password', { type: 'manual', message: msg });
			} else {
				setError('identifier', { type: 'manual', message: msg });
			}
		},
	});

	const onSubmit: SubmitHandler<LoginPayload> = (data) =>
		loginMutation.mutate(data);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-muted via-white to-primary-lighter relative overflow-hidden">
			{/* Welcome Header */}
			<motion.div
				initial="hidden"
				animate="visible"
				variants={formVariants}
				className="relative z-10 w-full max-w-max bg-background p-8 rounded-xl shadow-xl border border-border"
			>
				<Image
					src="/savoury-logo.png"
					alt="Savoury Logo"
					width={102}
					height={102}
					className="mx-auto drop-shadow-lg"
					priority
				/>
				<div className="flex flex-col items-center mb-6">
					<motion.h1
						className="text-3xl font-bold text-primary mb-1"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						Welcome to Savoury
					</motion.h1>
					<p className="text-base text-muted text-center mb-2">
						Unlock your flavor. Sign in to join the culinary
						community!
					</p>
					{/* Feature Highlights */}
					<div className="flex gap-6 mt-2">
						<motion.div whileHover={{ scale: 1.2 }}>
							<FontAwesomeIcon
								icon={faUtensils}
								className="text-primary text-xl"
							/>
						</motion.div>
						<motion.div whileHover={{ scale: 1.2 }}>
							<FontAwesomeIcon
								icon={faStar}
								className="text-warning text-xl"
							/>
						</motion.div>
						<motion.div whileHover={{ scale: 1.2 }}>
							<FontAwesomeIcon
								icon={faUsers}
								className="text-success text-xl"
							/>
						</motion.div>
					</div>
				</div>

				{/* Form */}
				<form
					className="space-y-6"
					onSubmit={handleSubmit(onSubmit)}
					aria-label="Login form"
				>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-foreground"
							>
								Email address or username
							</label>
							<input
								{...register('identifier', {
									required: 'Email or username is required',
								})}
								type="text"
								className="mt-1 block w-full px-5 py-3 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
								placeholder="Enter your email or username"
								aria-invalid={!!errors.identifier}
								aria-describedby="identifier-error"
							/>
						</div>
						{errors.identifier && (
							<motion.p
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
								className="mt-1 text-sm text-error"
							>
								{errors.identifier.message}
							</motion.p>
						)}

						<div className="relative">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-foreground"
							>
								Password
							</label>
							<input
								type={passwordShow ? 'text' : 'password'}
								{...register('password', {
									required: 'Password is required',
									minLength: {
										value: 6,
										message:
											'Password must be at least 6 characters',
									},
								})}
								className="mt-1 block w-full px-5 py-3 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
								placeholder="Enter your password"
								aria-invalid={!!errors.password}
								aria-describedby="password-error"
							/>
							<motion.button
								type="button"
								onClick={() => setPasswordShow(!passwordShow)}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								className="absolute cursor-pointer right-3 top-2/3 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
								disabled={loginMutation.isPending}
							>
								<FontAwesomeIcon
									icon={passwordShow ? faEyeSlash : faEye}
									size="xl"
								/>
							</motion.button>
						</div>
						{errors.password && (
							<motion.p
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
								className="mt-1 text-sm text-error"
							>
								{errors.password.message}
							</motion.p>
						)}
					</div>
					<div>
						<motion.button
							type="submit"
							disabled={loginMutation.isPending}
							className="group relative cursor-pointer uppercase w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-button-primary-text bg-button-primary hover:bg-button-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
						>
							{loginMutation.isPending ? (
								<Skeleton
									width={80}
									height={20}
									baseColor="#d8efd3"
									highlightColor="#95d2b3"
								/>
							) : (
								'Login'
							)}
						</motion.button>
					</div>

					<div className="flex justify-between items-center text-sm mt-2">
						<Link
							href="/forgot-password"
							className="text-primary hover:text-primary-hover transition-colors"
						>
							Forgot password?
						</Link>
						<Link
							href="/register"
							className="font-medium text-primary hover:text-primary-hover transition-colors"
						>
							Create account
						</Link>
					</div>
				</form>
			</motion.div>
			{/* Footer */}
			<footer className="mt-4 text-center text-muted text-xs">
				<Link
					href="/recipes"
					className="hover:text-primary transition-colors mx-2"
				>
					Explore Recipes
				</Link>
				|
				<Link
					href="/community"
					className="hover:text-primary transition-colors mx-2"
				>
					Community
				</Link>
				|
				<Link
					href="/about"
					className="hover:text-primary transition-colors mx-2"
				>
					About
				</Link>
			</footer>
		</div>
	);
}
