'use client';

import Link from 'next/link';
import Image from 'next/image';
import Form from "next/form";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faEye,
	faEyeSlash,
	faArrowLeft,
	faEnvelope,
	faKey,
	faCheckCircle,
	faXmarkCircle,
	faShieldAlt,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/services/Auth';
import {
	ForgotPasswordEmailPayload,
	OtpPayload,
	ChangePasswordPayload,
} from '@/types/AuthResponse';
import { validatePassword, validateEmail } from '@/utils/regex';

enum ForgotPasswordSteps {
	EMAIL = 'email',
	OTP = 'otp',
	NEW_PASSWORD = 'new_password',
}

const pageVariants = {
	hidden: { opacity: 0, y: 40, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
	exit: {
		opacity: 0,
		y: -40,
		scale: 0.95,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};

const stepTransition = {
	hidden: { opacity: 0, x: 100 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
	exit: {
		opacity: 0,
		x: -100,
		transition: {
			duration: 0.3,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};

export default function ForgotPasswordPage() {
	const [step, setStep] = useState<ForgotPasswordSteps>(ForgotPasswordSteps.EMAIL);
	const [userEmail, setUserEmail] = useState<string>('');
	const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
	const [otpError, setOtpError] = useState<string>('');
	const [passwordShow, setPasswordShow] = useState<boolean>(false);
	const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);
	const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

	const router = useRouter();

	// Step 1: Email form
	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: emailErrors },
		setError: setEmailError,
	} = useForm<ForgotPasswordEmailPayload>({
		mode: 'onSubmit',
	});

	// Step 3: New password form
	const {
		register: registerPassword,
		handleSubmit: handleSubmitPassword,
		formState: { errors: passwordErrors },
		setError: setPasswordError,
		watch,
	} = useForm<Omit<ChangePasswordPayload, 'email' | 'otp'>>({
		mode: 'onSubmit',
	});

	const newPassword = watch('newPassword');

	// Mutation for sending OTP to email
	const sendOtpMutation = useMutation({
		mutationFn: (payload: ForgotPasswordEmailPayload) =>
			auth.forgotPasswordSendOtp(payload),
		onSuccess: (response, variables) => {
			setUserEmail(variables.email);
			setStep(ForgotPasswordSteps.OTP);
			setOtpError('');
			setOtp(['', '', '', '', '']);
		},
		onError: (error: Error) => {
			const msg =
				error.message || 'Failed to send OTP. Please try again.';
			if (msg.includes('User not found')) {
				setEmailError('email', {
					type: 'manual',
					message: 'No account found with this email address.',
				});
			} else {
				setEmailError('email', { type: 'manual', message: msg });
			}
		},
	});

	// Mutation for verifying OTP
	const verifyOtpMutation = useMutation({
		mutationFn: (payload: OtpPayload) => auth.verifyForgotPassword(payload),
		onSuccess: () => {
			setStep(ForgotPasswordSteps.NEW_PASSWORD);
			setOtpError('');
		},
		onError: (error: Error) => {
			setOtpError(error.message || 'Invalid OTP. Please try again.');
		},
	});

	// Mutation for resetting password
	const resetPasswordMutation = useMutation({
		mutationFn: (payload: ChangePasswordPayload) => auth.resetPassword(payload),
		onSuccess: () => {
            router.prefetch("/forgot");
			router.refresh();
		},
		onError: (error: Error) => {
			const msg =
				error.message || 'Failed to reset password. Please try again.';
			if (msg.includes('Passwords do not match')) {
				setPasswordError('confirmPassword', {
					type: 'manual',
					message: 'Passwords do not match.',
				});
			} else {
				setPasswordError('newPassword', {
					type: 'manual',
					message: msg,
				});
			}
		},
	});

	const onSubmitEmail: SubmitHandler<ForgotPasswordEmailPayload> = (data) => {
		sendOtpMutation.mutate(data);
	};

	const onSubmitPassword: SubmitHandler<Omit<ChangePasswordPayload, 'email' | 'otp'>> = (data) => {
		const otpValue = otp.join('');
		resetPasswordMutation.mutate({
			email: userEmail,
			otp: otpValue,
			newPassword: data.newPassword,
			confirmPassword: data.confirmPassword,
		});
	};

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setOtpError('');

		if (value && index < 4) otpRefs.current[index + 1]?.focus();
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			otpRefs.current[index - 1]?.focus();
		}
	};

	const handleOtpSubmit = () => {
		const otpValue = otp.join('');
		if (otpValue.length === 5) {
			verifyOtpMutation.mutate({ email: userEmail, otp: otpValue });
		} else {
			setOtpError('Please enter the complete 5-digit OTP.');
		}
	};

	const handleResendOtp = () => {
		sendOtpMutation.mutate({ email: userEmail });
	};

	const getStepTitle = () => {
		switch (step) {
			case ForgotPasswordSteps.EMAIL:
				return 'Reset Your Password';
			case ForgotPasswordSteps.OTP:
				return 'Verify Your Identity';
			case ForgotPasswordSteps.NEW_PASSWORD:
				return 'Create New Password';
			default:
				return 'Reset Password';
		}
	};

	const getStepDescription = () => {
		switch (step) {
			case ForgotPasswordSteps.EMAIL:
				return "Enter your email address and we'll send you a verification code.";
			case ForgotPasswordSteps.OTP:
				return `We've sent a 5-digit code to ${userEmail}. Enter it below to continue.`;
			case ForgotPasswordSteps.NEW_PASSWORD:
				return "Enter your new password. Make sure it's strong and secure.";
			default:
				return '';
		}
	};

	const getStepIcon = () => {
		switch (step) {
			case ForgotPasswordSteps.EMAIL:
				return faEnvelope;
			case ForgotPasswordSteps.OTP:
				return faShieldAlt;
			case ForgotPasswordSteps.NEW_PASSWORD:
				return faKey;
			default:
				return faEnvelope;
		}
	};

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-muted via-white to-primary-lighter relative overflow-hidden">
			{/* Background Animation Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: 'linear' as const,
					}}
					className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-primary/10"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						rotate: [360, 180, 0],
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						ease: 'linear' as const,
					}}
					className="absolute -bottom-1/3 -left-1/3 w-80 h-80 rounded-full bg-primary-light/20"
				/>
				<motion.div
					animate={{
						y: [-20, 20, -20],
						x: [-10, 10, -10],
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: 'easeInOut' as const,
					}}
					className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-primary/30"
				/>
			</div>

			{/* Back Button */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2 }}
				className="absolute top-6 left-6 z-20"
			>
				<Link
					href="/login"
					className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
				>
					<FontAwesomeIcon icon={faArrowLeft} />
					<span className="font-medium">Back to Login</span>
				</Link>
			</motion.div>

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={pageVariants}
					className="w-full max-w-max mx-auto"
				>
					<div className="bg-background rounded-2xl shadow-xl border border-border p-8">
						{/* Logo */}
						<div className="text-center mb-8">
							<motion.div
								whileHover={{ scale: 1.05 }}
								transition={{
									type: 'spring' as const,
									stiffness: 300,
								}}
							>
								<Image
									src="/savoury-logo.png"
									alt="Savoury Logo"
									width={80}
									height={80}
									className="mx-auto drop-shadow-lg"
									priority
								/>
							</motion.div>
						</div>

						{/* Step Indicator */}
						<div className="flex justify-center items-center gap-2 mb-8">
							{Object.values(ForgotPasswordSteps).map(
								(stepValue, index) => (
									<div
										key={stepValue}
										className="flex items-center gap-2"
									>
										<motion.div
											animate={{
												backgroundColor: step === stepValue ? '#55ad9b' : '#e5e7eb',
												scale: step === stepValue ? 1.2 : 1,
											}}
											className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
										>
											{index + 1}
										</motion.div>
										{index < Object.values(ForgotPasswordSteps).length - 1 && (
											<div className="w-8 h-0.5 bg-border" />
										)}
									</div>
								)
							)}
						</div>

						{/* Step Header */}
						<div className="text-center mb-6">
							<motion.div
								className="text-primary text-3xl mb-3"
								animate={{
									rotate:
										step === ForgotPasswordSteps.OTP
											? [0, -5, 5, 0]
											: 0,
								}}
								transition={{ duration: 0.5 }}
							>
								<FontAwesomeIcon icon={getStepIcon()} />
							</motion.div>
							<motion.h1
								key={step}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-2xl font-bold text-foreground mb-2"
							>
								{getStepTitle()}
							</motion.h1>
							<motion.p
								key={`${step}-desc`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.1 }}
								className="text-sm text-muted"
							>
								{getStepDescription()}
							</motion.p>
						</div>

						{/* Step Content */}
						<AnimatePresence mode="wait">
							{step === ForgotPasswordSteps.EMAIL && (
								<motion.div
									key="email-step"
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={stepTransition}
								>
									<form
										onSubmit={handleSubmitEmail(onSubmitEmail)}
										className="space-y-6"
									>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-foreground mb-2"
											>
												Email Address
											</label>
											<motion.input
												type="email"
												{...registerEmail('email', {
													required: 'Email address is required',
													validate: (value) =>
														validateEmail(value, 'rfcLike') ||
														'Please enter a valid email address',
												})}
												whileFocus={{ scale: 1.02 }}
												className="w-full px-4 py-3 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
												placeholder="Enter your email"
												disabled={sendOtpMutation.isPending}
											/>
											{emailErrors.email && (
												<motion.p
													initial={{
														opacity: 0,
														y: -10,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													className="mt-2 text-sm text-error"
												>
													{emailErrors.email.message}
												</motion.p>
											)}
										</div>

										<motion.button
											type="submit"
											disabled={sendOtpMutation.isPending}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
										>
											{sendOtpMutation.isPending ? (
												<>
													<FontAwesomeIcon
														icon={faSpinner}
														spin
													/>
													<span>Sending Code...</span>
												</>
											) : (
												<>
													<FontAwesomeIcon
														icon={faEnvelope}
													/>
													<span>
														Send Verification Code
													</span>
												</>
											)}
										</motion.button>
									</form>
								</motion.div>
							)}

							{step === ForgotPasswordSteps.OTP && (
								<motion.div
									key="otp-step"
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={stepTransition}
								>
									<div className="space-y-6">
										<div className="flex justify-center gap-3 mb-6">
											{otp.map((digit, index) => (
												<motion.input
													key={index}
													ref={(el) => {otpRefs.current[index] = el;}}
													initial={{ scale: 0, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{ delay: index * 0.1 + 0.3 }}
													whileFocus={{ scale: 1.05 }}
													type="text"
													maxLength={1}
													value={digit}
													onChange={(e) => handleOtpChange(index, e.target.value)}
													onKeyDown={(e) => handleOtpKeyDown(index, e)}
													className="w-12 h-12 text-center text-lg font-bold border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
													disabled={verifyOtpMutation.isPending}
												/>
											))}
										</div>

										{otpError && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="text-center text-sm text-error mb-4"
											>
												{otpError}
											</motion.p>
										)}

										<motion.button
											onClick={handleOtpSubmit}
											disabled={verifyOtpMutation.isPending}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
										>
											{verifyOtpMutation.isPending ? (
												<>
													<FontAwesomeIcon
														icon={faSpinner}
														spin
													/>
													<span>Verifying...</span>
												</>
											) : (
												<>
													<FontAwesomeIcon
														icon={faShieldAlt}
													/>
													<span>Verify Code</span>
												</>
											)}
										</motion.button>

										<div className="text-center">
											<p className="text-sm text-muted mb-2">
												Didn't receive the code?
											</p>
											<motion.button
												onClick={handleResendOtp}
												disabled={sendOtpMutation.isPending}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												className="text-sm cursor-pointer font-medium text-primary hover:text-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{sendOtpMutation.isPending
													? 'Sending...'
													: 'Resend Code'}
											</motion.button>
										</div>
									</div>
								</motion.div>
							)}

							{step === ForgotPasswordSteps.NEW_PASSWORD && (
								<motion.div
									key="password-step"
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={stepTransition}
								>
									<Form 
                                        onSubmit={handleSubmitPassword(onSubmitPassword)}
										className="space-y-6"
                                        action="/login"
									>
										<div className="relative">
											<div className="flex items-center justify-between mb-2">
												<label
													htmlFor="newPassword"
													className="block text-sm font-medium text-foreground"
												>
													New Password
												</label>
												<div className="group">
													<span className={validatePassword(newPassword, 'lowerUpperDigitSpecial')
															? 'text-success px-2 py-1 rounded text-xs cursor-pointer'
															: 'text-error px-2 py-1 rounded text-xs cursor-pointer'
														}
													>
														{validatePassword(
															newPassword,
															'lowerUpperDigitSpecial'
														) ? (
															<FontAwesomeIcon
																icon={faCheckCircle}
																size="lg"
															/>
														) : (
															<FontAwesomeIcon
																icon={faXmarkCircle}
																size="lg"
															/>
														)}
													</span>
													<div className="absolute z-20 w-64 bg-background border border-border rounded shadow-lg p-3 text-xs right-0 mt-2 hidden group-hover:block">
														<h2 className="font-semibold mb-2">
															Password Requirements:
														</h2>
														<ul className="space-y-1">
															<li className="flex items-center gap-2">
																<span className={validatePassword(newPassword, 'minLength8')
																		? 'text-success font-bold'
																		: 'text-muted'
																	}
																>
																	●
																</span>
																<span>
																	At least 8 characters
																</span>
															</li>
															<li className="flex items-center gap-2">
																<span className={validatePassword(newPassword, 'lowerUpperDigit')
																		? 'text-success font-bold'
																		: 'text-muted'
																	}
																>
																	●
																</span>
																<span>
																	Upper & lowercase letters, numbers
																</span>
															</li>
															<li className="flex items-center gap-2">
																<span className={validatePassword(newPassword, 'lowerUpperDigitSpecial')
																		? 'text-success font-bold'
																		: 'text-muted'
																	}
																>
																	●
																</span>
																<span>
																	At least one special character
																</span>
															</li>
														</ul>
													</div>
												</div>
											</div>
											<motion.input
												type={passwordShow ? 'text' : 'password'}
												{...registerPassword('newPassword', {
													required: 'New password is required',
													validate: (value) =>
														validatePassword(value, 'lowerUpperDigitSpecial') ||
														'Password does not meet requirements',
													}
												)}
												whileFocus={{ scale: 1.02 }}
												className="w-full px-4 py-3 pr-12 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
												placeholder="Enter new password"
												disabled={resetPasswordMutation.isPending}
											/>
											<motion.button
												type="button"
												onClick={() => setPasswordShow(!passwordShow)}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												className="absolute cursor-pointer right-3 top-2/3 transform -translate-y-1/2 text-muted hover:text-foreground transition-colors"
												disabled={resetPasswordMutation.isPending}
											>
												<FontAwesomeIcon
													icon={passwordShow ? faEyeSlash : faEye}
													size="xl"
												/>
											</motion.button>
											{passwordErrors.newPassword && (
												<motion.p
													initial={{
														opacity: 0,
														y: -10,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													className="mt-2 text-sm text-error"
												>
													{passwordErrors.newPassword.message}
												</motion.p>
											)}
										</div>

										<div className="relative">
											<label
												htmlFor="confirmPassword"
												className="block text-sm font-medium text-foreground mb-2"
											>
												Confirm New Password
											</label>
											<motion.input
												type={confirmPasswordShow ? 'text' : 'password'}
												{...registerPassword('confirmPassword', {
													required: 'Please confirm your new password',
													validate: (value) =>
														value === newPassword || 'Passwords do not match',
													}
												)}
												whileFocus={{ scale: 1.02 }}
												className="w-full px-4 py-3 pr-12 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
												placeholder="Confirm new password"
												disabled={resetPasswordMutation.isPending}
											/>
											<motion.button
												type="button"
												onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												className="absolute cursor-pointer right-3 top-2/3 transform -translate-y-1/2 text-muted hover:text-foreground transition-colors"
												disabled={resetPasswordMutation.isPending}
											>
												<FontAwesomeIcon
													icon={confirmPasswordShow ? faEyeSlash : faEye}
													size="xl"
												/>
											</motion.button>
											{passwordErrors.confirmPassword && (
												<motion.p
													initial={{
														opacity: 0,
														y: -10,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													className="mt-2 text-sm text-error"
												>
													{passwordErrors.confirmPassword.message}
												</motion.p>
											)}
										</div>

										<motion.button
											type="submit"
											disabled={
												resetPasswordMutation.isPending
											}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
										>
											{resetPasswordMutation.isPending ? (
												<>
													<FontAwesomeIcon
														icon={faSpinner}
														spin
													/>
													<span>
														Resetting Password...
													</span>
												</>
											) : (
												<>
													<FontAwesomeIcon
														icon={faKey}
													/>
													<span>Reset Password</span>
												</>
											)}
										</motion.button>
									</Form>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Footer */}
						<div className="text-center mt-6 pt-6 border-t border-border">
							<p className="text-sm text-muted">
								Remember your password?{' '}
								<Link
									href="/login"
									className="font-medium text-primary hover:text-primary-hover transition-colors"
								>
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
