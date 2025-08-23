import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'res.cloudinary.com',
				protocol: 'https',
			}
		]
	},
	output: 'standalone',
	experimental: {
		globalNotFound: true
	}
};

export default nextConfig;
