import '../../globals.css';
import type { Metadata } from 'next';
import Navbar from '@/layouts/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketManager, SocketProvider } from '@/contexts/SocketContext';
import { getCurrentUser, getSession } from '@/lib/auth';

export const metadata: Metadata = {
	title: 'Savoury - Unlock your Flavor',
	description: 'Your Modern Food Recipe Sharing Platform',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let userDetails;
	const session = await getSession();

	if (session) {
		const user = await getCurrentUser();
		if (user) {
			userDetails = {
				id: String(user.user_id),
				email: user.email || '',
				username: user.username || '',
				fullname: user.fullname || '',
				profile_image: user.profile_image || '',
			};
		}
	}

	return (
		<main>
			<SocketProvider>
				<Navbar userDetails={userDetails} />
				{children}
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					pauseOnHover
				/>
			</SocketProvider>
		</main>
	);
}
