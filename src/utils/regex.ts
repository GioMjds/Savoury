const passwordRegexes = {
	minLength8: /^.{8,}$/,
	lowerUpperDigit: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
	lowerUpperDigitSpecial:
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/,
	strictAlphanumeric: /^(?=.{8,16}$)(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
	strongNoWhitespace:
		/^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).+$/,
	noTripleRepeat: /^(?!.*(.)\1\1)(?=.{8,}$).+$/,
};

const emailRegexes = {
	basic: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
	rfcLike: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
	specificTLD: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|net|org|edu)$/,
	specificDomains: /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/,
	subdomains: /^[A-Za-z0-9._%+-]+@(?:[\w-]+\.)+(?:com|io|co\.uk)$/,
	noNumericOnlyLocal:
		/^(?!\d+$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
};

export function validatePassword(
	password: string,
	type: keyof typeof passwordRegexes
): boolean {
	return passwordRegexes[type].test(password);
}

export function validateEmail(
	email: string,
	type: keyof typeof emailRegexes
): boolean {
	return emailRegexes[type].test(email);
}

export function validateNewAccount(
	email: string,
	password: string,
	options?: {
		emailPolicy?: keyof typeof emailRegexes;
		passwordPolicy?: keyof typeof passwordRegexes;
	}
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	const emailPolicy = options?.emailPolicy ?? 'rfcLike';
	const passwordPolicy = options?.passwordPolicy ?? 'lowerUpperDigitSpecial';

	if (!validateEmail(email, emailPolicy)) {
		errors.push(`Email does not match policy: ${emailPolicy}`);
	}

	if (!validatePassword(password, passwordPolicy)) {
		errors.push(`Password does not match policy: ${passwordPolicy}`);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
