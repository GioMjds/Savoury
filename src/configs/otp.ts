interface OtpCacheEntry {
	otp: string;
	hashedPassword: string;
	firstName: string;
	lastName: string;
	username: string;
	expiresAt: Date;
}

const otpCache = new Map<String, OtpCacheEntry>();

setInterval(() => {
	const now = new Date();
	otpCache.forEach((entry, email) => {
		if (entry.expiresAt < now) {
			otpCache.delete(email);
		}
	});
}, 5 * 60 * 1000);

export const otpStorage = {
	set: (
		firstName: string,
		lastName: string,
		email: string,
		otp: string,
		hashedPassword: string,
		username: string,
		ttlMinutes = 5,
	) => {
		const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
		otpCache.set(email, {
			otp,
			hashedPassword,
			firstName,
			lastName,
			username,
			expiresAt,
		});
	},
	get: (email: string) => otpCache.get(email),
	delete: (email: string) => otpCache.delete(email),
	validate: (email: string, userOtp: string) => {
		const entry = otpCache.get(email);
		if (!entry) return { valid: false, error: 'OTP not found' };
		if (entry.otp !== userOtp) return { valid: false, error: 'Invalid OTP' };
		if (new Date() > entry.expiresAt) return { valid: false, error: 'OTP expired' };
		return {
			valid: true,
			data: {
				hashedPassword: entry.hashedPassword,
				firstName: entry.firstName,
				lastName: entry.lastName,
				username: entry.username,
			},
		};
	},
};
