import '../globals.css';
import type { Metadata } from 'next';
import { Kumbh_Sans } from 'next/font/google';
import Providers from '@/providers/tanstack-query';
import Navbar from '@/layouts/Navbar';
import Footer from '@/layouts/Footer';
import { getCurrentUser, getSession } from '@/lib/auth';

const kumbhSans = Kumbh_Sans({
	variable: '--font-kumbh-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Savoury - Unlock your Flavor',
	description: 'Your Modern Food Recipe Sharing Platform',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let userDetails: object | null = null;
	const session = await getSession();
	
	if (session) {
		const user = await getCurrentUser();
		userDetails = {
			id: user?.user_id,
			email: user?.email,
			username: user?.username,
			fullname: user?.fullname,
			profile_image: user?.profile_image
		}
	}

	return (
		<html lang="en">
			<body
				className={`${kumbhSans.variable} ${kumbhSans.style} antialiased`}
			>
				<Providers>
					<Navbar userDetails={userDetails} />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
