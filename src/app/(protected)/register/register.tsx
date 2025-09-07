'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faEye,
	faEyeSlash,
	faArrowLeft,
	faCheck,
	faUserPlus,
	faLock,
	faX,
	faCheckCircle,
	faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '@/services/Auth';
import { RegisterPayload, OtpPayload } from '@/types/AuthResponse';
import { passwordRequirements, validatePassword } from '@/utils/regex';

enum RegistrationSteps {
	FORMS = 'forms',
	OTP = 'otp',
}

const formVariants = {
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

export default function RegisterPage() {
	const [passwordShow, setPasswordShow] = useState<boolean>(false);
	const [confirmPassShow, setConfirmPassShow] = useState<boolean>(false);
	const [step, setStep] = useState<RegistrationSteps>(RegistrationSteps.FORMS);
	const [userEmail, setUserEmail] = useState<string>('');
	const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
	const [otpError, setOtpError] = useState<string>('');
	const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		watch,
		getValues,
	} = useForm<RegisterPayload>({
		mode: 'onSubmit',
	});

	const password = watch('password');

	const registerMutation = useMutation({
		mutationFn: (payload: RegisterPayload) => auth.sendRegisterOtp(payload),
		onSuccess: (response) => {
			setUserEmail(getValues('email'));
			setStep(RegistrationSteps.OTP);
		},
		onError: (error: Error) => {
			const msg =
				error.message || 'Registration failed. Please try again.';

			if (msg.includes('Username already taken')) {
				setError('username', { type: 'manual', message: msg });
			} else if (
				msg.includes('Email already exists') ||
				msg.includes('already taken')
			) {
				setError('email', { type: 'manual', message: msg });
			} else if (msg.includes('All fields are required')) {
				setError('firstName', { type: 'manual', message: msg });
			} else {
				setError('email', { type: 'manual', message: msg });
			}
		},
	});

	// OTP Verification
	const otpMutation = useMutation({
		mutationFn: (payload: OtpPayload) => auth.verifyRegisterOtp(payload),
		onSuccess: () => {
			router.push('/login');
		},
		onError: (error: Error) => {
			setOtpError(error.message || 'Invalid OTP. Please try again.');
		},
	});

	// Resend OTP
	const resendOtpMutation = useMutation({
		mutationFn: () => {
			const values = getValues();
			return auth.resendOtp({
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				username: values.username,
			});
		},
		onSuccess: () => {
			setOtpError('');
			setOtp(['', '', '', '', '']);
		},
		onError: (error: Error) => {
			setOtpError(error.message || 'Failed to resend OTP.');
		},
	});

	const onSubmit: SubmitHandler<RegisterPayload> = (data) => {
		registerMutation.mutate(data);
	};

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setOtpError('');

		if (value && index < 4) {
			otpRefs.current[index + 1]?.focus();
		}
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			otpRefs.current[index - 1]?.focus();
		}
	};

	const handleOtpSubmit = () => {
		const otpValue = otp.join('');
		if (otpValue.length === 5) {
			otpMutation.mutate({ email: userEmail, otp: otpValue });
		} else {
			setOtpError('Please enter the complete 5-digit OTP.');
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
						ease: 'linear',
					}}
					className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						rotate: [360, 180, 0],
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: 'linear',
					}}
					className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary-light/10 rounded-full"
				/>
			</div>

			<AnimatePresence mode="wait">
				{step === RegistrationSteps.FORMS ? (
					<motion.div
						key="forms"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={formVariants}
						className="flex w-full relative z-10"
					>
						{/* Left Side - Brand Section */}
						<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-primary-light/20 items-center justify-center p-12">
							<div className="text-center max-w-max mx-auto">
								<motion.div
									whileHover={{ scale: 1.05, rotate: 5 }}
									transition={{
										type: 'spring',
										stiffness: 300,
									}}
								>
									<Image
										src="/savoury-logo.png"
										alt="Savoury Logo"
										width={200}
										height={200}
										className="mx-auto drop-shadow-lg mb-2"
										priority
									/>
								</motion.div>
								<motion.h1
									className="text-4xl font-bold text-primary mb-4"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									Create your Savoury Account!
								</motion.h1>
								<motion.p
									className="text-2xl text-muted-foreground mb-6"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
								>
									Create your account and start your culinary journey with thousands of amazing recipes
								</motion.p>
								<motion.div
									className="flex items-center justify-center gap-2 text-primary"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<FontAwesomeIcon
										icon={faUserPlus}
										className="text-lg"
									/>
									<span className="text-sm font-medium">
										Step 1 of 2
									</span>
								</motion.div>
							</div>
						</div>

						{/* Right Side - Form Section */}
						<div className="w-full lg:w-1/2 flex items-center justify-center p-8">
							<div className="w-full max-w-max mx-auto bg-background rounded-xl shadow-xl border border-border p-8">
								{/* Mobile Logo - only show on small screens */}
								<div className="lg:hidden flex flex-col items-center mb-6">
									<motion.div
										whileHover={{ scale: 1.05, rotate: 5 }}
										transition={{
											type: 'spring',
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
									<motion.h1
										className="text-3xl font-bold text-primary mb-2 mt-4"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
									>
										Join Savoury
									</motion.h1>
									<p className="text-sm text-muted text-center">
										Create your account and start your
										culinary journey
									</p>
									<motion.div
										className="flex items-center gap-2 mt-3 text-primary"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.4 }}
									>
										<FontAwesomeIcon
											icon={faUserPlus}
											className="text-lg"
										/>
										<span className="text-sm font-medium">
											Step 1 of 2
										</span>
									</motion.div>
								</div>

								<form
									className="space-y-4"
									onSubmit={handleSubmit(onSubmit)}
								>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="firstName"
												className="block text-sm font-medium text-foreground mb-1"
											>
												First Name
											</label>
											<motion.input
												type="text"
												{...register('firstName', {
													required: 'First name is required',
													minLength: {
														value: 2,
														message: 'First name must be at least 2 characters',
													},
												})}
												whileFocus={{ scale: 1.02 }}
												className="w-full px-4 py-3 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
												placeholder="Enter your first name"
											/>
											{errors.firstName && (
												<motion.p
													initial={{
														opacity: 0,
														y: -10,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													className="mt-1 text-xs text-error"
												>
													{errors.firstName.message}
												</motion.p>
											)}
										</div>
										<div>
											<label
												htmlFor="lastName"
												className="block text-sm font-medium text-foreground mb-1"
											>
												Last Name
											</label>
											<motion.input
                                                type="text"
												{...register('lastName', {
													required: 'Last name is required',
													minLength: {
														value: 2,
														message: 'Last name must be at least 2 characters',
													},
												})}
												whileFocus={{ scale: 1.02 }}
												className="w-full px-4 py-3 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
												placeholder="Enter your last name"
											/>
											{errors.lastName && (
												<motion.p
													initial={{
														opacity: 0,
														y: -10,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													className="mt-1 text-xs text-error"
												>
													{errors.lastName.message}
												</motion.p>
											)}
										</div>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-foreground mb-1"
										>
											Email Address
										</label>
										<motion.input
											type="email"
											{...register('email', {
												required: 'Email is required',
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message:
														'Invalid email address',
												},
											})}
											whileFocus={{ scale: 1.02 }}
											className="w-full px-4 py-3 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
											placeholder="example@gmail.com"
										/>
										{errors.email && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="mt-1 text-xs text-error"
											>
												{errors.email.message}
											</motion.p>
										)}
									</div>

									<div>
										<label
											htmlFor="username"
											className="block text-sm font-medium text-foreground mb-1"
										>
											Username
										</label>
										<motion.input
											{...register('username', {
												required: 'Username is required',
												minLength: {
													value: 3,
													message: 'Username must be at least 3 characters',
												},
												pattern: {
													value: /^[a-zA-Z0-9_]+$/,
													message: 'Username can only contain letters, numbers, and underscores',
												},
											})}
											whileFocus={{ scale: 1.02 }}
											type="text"
											className="w-full px-4 py-3 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
											placeholder="Your desired username here"
										/>
										{errors.username && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="mt-1 text-xs text-error"
											>
												{errors.username.message}
											</motion.p>
										)}
									</div>

									<div className="relative">
										<div className="flex items-center justify-between mb-1">
											<label
												htmlFor="password"
												className="block text-sm font-medium text-foreground"
											>
												Password
											</label>
											{/* Password Validity Indicator */}
											<div className="group ml-2">
												<span className={validatePassword(password, 'lowerUpperDigitSpecial')
														? 'text-green-500 px-2 py-1 rounded text-xs cursor-pointer'
														: 'text-red-500 px-2 py-1 rounded text-xs cursor-pointer'
													}
												>
													{validatePassword(password, 'lowerUpperDigitSpecial') 
														? <FontAwesomeIcon icon={faCheckCircle} size="xl" /> 
														: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />}
												</span>
												<div className="absolute z-20 w-64 bg-white border border-border rounded shadow-lg p-3 text-xs left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block">
													<div className="font-semibold mb-2">Password Requirements:</div>
													<ul className="space-y-1">
														{passwordRequirements.map((req) => (
															<li key={req.key} className="flex items-center gap-2">
																<span className={validatePassword(password, req.key as any)
																		? 'text-green-600 font-bold'
																		: 'text-gray-400'
																	}
																>
																	●
																</span>
																<span>{req.label}</span>
															</li>
														))}
													</ul>
												</div>
											</div>
										</div>
										<motion.input
											type={passwordShow ? 'text' : 'password'}
											{...register('password', {
												required: 'Password is required',
												validate: (value) =>
													validatePassword(value, 'lowerUpperDigitSpecial') ||
													'Password does not meet requirements',
											})}
											whileFocus={{ scale: 1.02 }}
											className="w-full px-4 py-3 pr-12 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
											placeholder="Password"
										/>
										<motion.button
											type="button"
											onClick={() => setPasswordShow(!passwordShow)}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="absolute cursor-pointer right-3 top-9 text-muted hover:text-foreground transition-colors"
										>
											<FontAwesomeIcon icon={passwordShow ? faEyeSlash : faEye} size="xl" />
										</motion.button>
										{errors.password && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="mt-1 text-xs text-error"
											>
												{errors.password.message}
											</motion.p>
										)}
									</div>

									<div className="relative">
										<label
											htmlFor="confirmPassword"
											className="block text-sm font-medium text-foreground mb-1"
										>
											Confirm Password
										</label>
										<motion.input
											type={confirmPassShow ? 'text' : 'password'}
											{...register('confirmPassword', {
												required: 'Please confirm your password',
												validate: (value) =>
													value === password || 'Passwords do not match',
											})}
											whileFocus={{ scale: 1.02 }}
											className="w-full px-4 py-3 pr-12 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
											placeholder="Confirm Password"
										/>
										<motion.button
											type="button"
											onClick={() => setConfirmPassShow(!confirmPassShow)}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="absolute cursor-pointer right-3 top-9 text-muted hover:text-foreground transition-colors"
										>
											<FontAwesomeIcon icon={confirmPassShow ? faEyeSlash : faEye} size="xl" />
										</motion.button>
										{errors.confirmPassword && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="mt-1 text-xs text-error"
											>
												{errors.confirmPassword.message}
											</motion.p>
										)}
									</div>

									<motion.button
										type="submit"
										disabled={registerMutation.isPending}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="w-full bg-primary cursor-pointer hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
									>
										{registerMutation.isPending ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: 'linear',
												}}
												className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
											/>
										) : (
											'Continue to Verification'
										)}
									</motion.button>
								</form>

								<div className="text-center mt-6">
									<p className="text-sm text-muted">
										Already have an account?{' '}
										<Link
											href="/login"
											className="font-medium text-primary hover:text-primary-hover transition-colors"
										>
											Sign in
										</Link>
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="otp"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={stepTransition}
						className="flex items-center justify-center w-full relative z-10 p-8"
					>
						<div className="w-full max-w-max mx-auto bg-background rounded-xl shadow-xl border border-border p-8">
							<motion.button
								onClick={() => setStep(RegistrationSteps.FORMS)}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="mb-4 p-2 text-primary hover:text-primary-hover transition-colors"
							>
								<FontAwesomeIcon
									icon={faArrowLeft}
									className="mr-2"
								/>
								Back
							</motion.button>

							<div className="flex flex-col items-center mb-6">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										type: 'spring',
										stiffness: 200,
										delay: 0.2,
									}}
									className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
								>
									<FontAwesomeIcon
										icon={faLock}
										className="text-2xl text-primary"
									/>
								</motion.div>
								<h1 className="text-2xl font-bold text-primary mb-2">
									Verify Your Email
								</h1>
								<p className="text-sm text-muted text-center mb-2">
									We've sent a 5-digit code to
								</p>
								<p className="text-sm font-medium text-foreground">
									{userEmail}
								</p>
								<motion.div
									className="flex items-center gap-2 mt-3 text-primary"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<FontAwesomeIcon
										icon={faCheck}
										className="text-lg"
									/>
									<span className="text-sm font-medium">
										Step 2 of 2
									</span>
								</motion.div>
							</div>

							<div className="space-y-6">
								<div className="flex justify-center gap-3 mb-6">
									{otp.map((digit, index) => (
										<motion.input
											key={index}
											ref={(el) => {
												otpRefs.current[index] = el;
											}}
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{
												delay: index * 0.1 + 0.3,
											}}
											whileFocus={{ scale: 1.05 }}
											type="text"
											maxLength={1}
											value={digit}
											onChange={(e) =>
												handleOtpChange(
													index,
													e.target.value
												)
											}
											onKeyDown={(e) =>
												handleOtpKeyDown(index, e)
											}
											className="w-12 h-12 text-center text-lg font-bold border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
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
									disabled={otpMutation.isPending}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{otpMutation.isPending ? (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: 'linear',
											}}
											className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
										/>
									) : (
										'Verify & Create Account'
									)}
								</motion.button>

								<div className="text-center">
									<p className="text-sm text-muted mb-2">
										Didn't receive the code?
									</p>
									<motion.button
										onClick={() =>
											resendOtpMutation.mutate()
										}
										disabled={resendOtpMutation.isPending}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="text-sm cursor-pointer font-medium text-primary hover:text-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{resendOtpMutation.isPending
											? 'Sending...'
											: 'Resend Code'}
									</motion.button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
