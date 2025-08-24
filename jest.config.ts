module.exports = {
	testEnvironment: 'node',
	testMatch: [
		'<rootDir>/src/tests/**/*.test.ts',
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	setupFilesAfterEnv: [],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/tests/**',
	],
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};
