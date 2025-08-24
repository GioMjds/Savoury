import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/route';
import { cookiesToDelete, createSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { otpStorage } from '@/configs/otp';
import { compare, hash } from 'bcrypt';
import { sendOtpEmail } from '@/configs/email';
import cloudinary from '@/lib/cloudinary';
import fs from 'fs';

jest.mock('@/lib/auth', () => ({
	cookiesToDelete: jest
		.fn()
		.mockResolvedValue(['access_token', 'refresh_token']),
	createSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
	users: {
		findFirst: jest.fn(),
		findUnique: jest.fn(),
		create: jest.fn(),
	},
}));

jest.mock('@/configs/otp', () => ({
	otpStorage: {
		set: jest.fn(),
		get: jest.fn(),
		validate: jest.fn(),
	},
}));

jest.mock('bcrypt', () => ({
	compare: jest.fn(),
	hash: jest.fn(),
}));

jest.mock('@/configs/email', () => ({
	sendOtpEmail: jest.fn(),
}));

jest.mock('@/lib/cloudinary', () => ({
	uploader: {
		upload: jest.fn(),
	},
}));

jest.mock('fs', () => ({
	readFileSync: jest.fn(),
}));

describe('/api/auth', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Helper function to create mock request
	const createMockRequest = (
		action: string,
		body: any = {},
		cookies: Record<string, string> = {}
	) => {
		const url = new URL(`http://localhost:3000/api/auth?action=${action}`);

		const request = {
			nextUrl: {
				searchParams: url.searchParams,
			},
			json: jest.fn().mockResolvedValue(body),
			cookies: {
				get: jest.fn((name: string) =>
					cookies[name] ? { value: cookies[name] } : undefined
				),
			},
		} as unknown as NextRequest;

		return request;
	};

	describe('Login', () => {
		const mockUser = {
			user_id: 1,
			email: 'test@example.com',
			username: 'testuser',
			fullname: 'Test User',
			profile_image: 'image-url',
			password: 'hashedpassword',
		};

		it('should login successfully with email', async () => {
			const loginData = {
				identifier: 'test@example.com',
				password: 'password123',
			};
			const mockSession = {
				accessToken: 'token',
				refreshToken: 'refresh',
			};

			(prisma.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
			(compare as jest.Mock).mockResolvedValue(true);
			(createSession as jest.Mock).mockResolvedValue(mockSession);

			const request = createMockRequest('login', loginData);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(200);
			expect(responseData.message).toContain('Logged in successfully');
			expect(responseData.user.email).toBe(mockUser.email);
		});

		it('should login successfully with username', async () => {
			const loginData = {
				identifier: 'testuser',
				password: 'password123',
			};
			const mockSession = {
				accessToken: 'token',
				refreshToken: 'refresh',
			};

			(prisma.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
			(compare as jest.Mock).mockResolvedValue(true);
			(createSession as jest.Mock).mockResolvedValue(mockSession);

			const request = createMockRequest('login', loginData);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(200);
			expect(responseData.user.username).toBe(mockUser.username);
		});

		it('should fail with missing credentials', async () => {
			const loginData = { identifier: '', password: '' };
			const request = createMockRequest('login', loginData);

			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(400);
			expect(responseData.error).toBe(
				'Email or username and password are required.'
			);
		});

		it('should fail with user not found', async () => {
			const loginData = {
				identifier: 'nonexistent@example.com',
				password: 'password123',
			};

			(prisma.users.findFirst as jest.Mock).mockResolvedValue(null);

			const request = createMockRequest('login', loginData);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(404);
			expect(responseData.error).toBe('No user found');
		});

		it('should fail with invalid password', async () => {
			const loginData = {
				identifier: 'test@example.com',
				password: 'wrongpassword',
			};

			(prisma.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
			(compare as jest.Mock).mockResolvedValue(false);

			const request = createMockRequest('login', loginData);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(401);
			expect(responseData.error).toBe('Invalid password');
		});

		it('should fail when session creation fails', async () => {
			const loginData = {
				identifier: 'test@example.com',
				password: 'password123',
			};

			(prisma.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
			(compare as jest.Mock).mockResolvedValue(true);
			(createSession as jest.Mock).mockResolvedValue(null);

			const request = createMockRequest('login', loginData);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(500);
			expect(responseData.error).toBe('Failed to create session');
		});
	});

	describe('Logout', () => {
		it('should logout successfully', async () => {
			const request = createMockRequest(
				'logout',
				{},
				{ access_token: 'valid-token' }
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(200);
			expect(responseData.message).toBe('Logged out successfully');
			expect(cookiesToDelete).toHaveBeenCalled();
		});

		it('should fail logout without session', async () => {
			const request = createMockRequest('logout');
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(401);
			expect(responseData.error).toBe('Unauthorized - No session found');
		});
	});

	describe('Send Register OTP', () => {
		const validRegistrationData = {
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			username: 'johndoe',
			password: 'password123',
			confirmPassword: 'password123',
		};

		it('should send OTP successfully', async () => {
			(prisma.users.findUnique as jest.Mock).mockResolvedValue(null);
			(hash as jest.Mock).mockResolvedValue('hashedpassword');
			(sendOtpEmail as jest.Mock).mockResolvedValue(true);

			const request = createMockRequest(
				'send_register_otp',
				validRegistrationData
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(200);
			expect(responseData.message).toBe('OTP sent successfully');
			expect(otpStorage.set).toHaveBeenCalled();
			expect(sendOtpEmail).toHaveBeenCalledWith(
				validRegistrationData.email,
				expect.any(String)
			);
		});

		it('should fail with missing fields', async () => {
			const incompleteData = { firstName: 'John' };

			const request = createMockRequest(
				'send_register_otp',
				incompleteData
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(400);
			expect(responseData.error).toBe('All fields are required');
		});

		it('should fail with password mismatch', async () => {
			const mismatchData = {
				...validRegistrationData,
				confirmPassword: 'differentpassword',
			};

			const request = createMockRequest(
				'send_register_otp',
				mismatchData
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(400);
			expect(responseData.error).toBe('Passwords do not match');
		});

		it('should fail with existing username', async () => {
			(prisma.users.findUnique as jest.Mock).mockResolvedValueOnce({
				username: 'johndoe',
			});

			const request = createMockRequest(
				'send_register_otp',
				validRegistrationData
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(409);
			expect(responseData.error).toBe('Username already taken');
		});

		it('should fail with existing email', async () => {
			(prisma.users.findUnique as jest.Mock)
				.mockResolvedValueOnce(null) // username check
				.mockResolvedValueOnce({ email: 'john@example.com' }); // email check

			const request = createMockRequest(
				'send_register_otp',
				validRegistrationData
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(409);
			expect(responseData.error).toBe('Email already taken');
		});
	});

	describe('Resend OTP', () => {
		it('should resend OTP successfully', async () => {
			const resendData = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				username: 'johndoe',
			};

			const mockOtpCache = {
				hashedPassword: 'hashedpassword',
			};

			(otpStorage.get as jest.Mock).mockReturnValue(mockOtpCache);
			(sendOtpEmail as jest.Mock).mockResolvedValue(true);

			const request = createMockRequest('resend_otp', resendData);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(200);
			expect(responseData.message).toBe('OTP resent successfully');
			expect(otpStorage.set).toHaveBeenCalled();
		});

		it('should fail when no OTP cache found', async () => {
			(otpStorage.get as jest.Mock).mockReturnValue(null);

			const request = createMockRequest('resend_otp', {
				email: 'john@example.com',
			});
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(404);
			expect(responseData.error).toBe(
				'No OTP request found for this email. Please initiate registration again.'
			);
		});
	});

	describe('Verify Register OTP', () => {
		it('should verify OTP and create user successfully', async () => {
			const verifyData = { email: 'john@example.com', otp: '12345' };

			const mockValidation = {
				valid: true,
				data: {
					hashedPassword: 'hashedpassword',
					firstName: 'John',
					lastName: 'Doe',
					username: 'johndoe',
				},
			};

			const mockNewUser = {
				fullname: 'John Doe',
				email: 'john@example.com',
				username: 'johndoe',
				profile_image: 'cloudinary-url',
			};

			(otpStorage.validate as jest.Mock).mockReturnValue(mockValidation);
			(fs.readFileSync as jest.Mock).mockReturnValue(
				Buffer.from('fake-image')
			);
			(cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
				secure_url: 'cloudinary-url',
			});
			(prisma.users.create as jest.Mock).mockResolvedValue(mockNewUser);

			const request = createMockRequest(
				'verify_register_otp',
				verifyData
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(201);
			expect(responseData.message).toBe('User registered successfully');
			expect(responseData.user.fullname).toBe('John Doe');
		});

		it('should fail with invalid OTP', async () => {
			const verifyData = { email: 'john@example.com', otp: '00000' };

			const mockValidation = {
				valid: false,
				error: 'Invalid OTP',
			};

			(otpStorage.validate as jest.Mock).mockReturnValue(mockValidation);

			const request = createMockRequest(
				'verify_register_otp',
				verifyData
			);
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(400);
			expect(responseData.error).toBe('Invalid OTP');
		});
	});

	describe('Invalid Action', () => {
		it('should return error for invalid action', async () => {
			const request = createMockRequest('invalid_action');
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(400);
			expect(responseData.error).toBe('Invalid action');
		});
	});

	describe('Error Handling', () => {
		it('should handle unexpected errors', async () => {
			(prisma.users.findFirst as jest.Mock).mockRejectedValue(
				new Error('Database error')
			);

			const request = createMockRequest('login', {
				identifier: 'test@example.com',
				password: 'password',
			});
			const response = await POST(request);
			const responseData = await response.json();

			expect(response.status).toBe(500);
			expect(responseData.error).toContain('/auth POST error:');
		});
	});
});
