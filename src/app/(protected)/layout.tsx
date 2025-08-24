import '../globals.css';
import type { Metadata } from 'next';
import { Kumbh_Sans } from 'next/font/google';
import Providers from '@/providers/tanstack-query';

const kumbhSans = Kumbh_Sans({
	variable: '--font-kumbh-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Savoury - Unlock your Flavor',
	description: 'Your Modern Food Recipe Sharing Platform',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${kumbhSans.variable} ${kumbhSans.style} antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
