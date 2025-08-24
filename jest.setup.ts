import 'jest-environment-node';

Object.defineProperty(process.env, 'NODE_ENV', {
	value: 'test',
	writable: false,
	enumerable: true,
	configurable: true
});
process.env.JWT_SECRET = 'kgiohqaxca';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

// Global test setup
global.console = {
	...console,
	error: jest.fn(),
	warn: jest.fn(),
};
