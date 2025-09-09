import type { Metadata } from 'next';
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { user } from '@/services/User';
import { getCurrentUser } from '@/lib/auth';
import ProfilePage from './profile';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ username: string }>;
}): Promise<Metadata> {
	const { username } = await params;

	try {
		const data = await user.fetchUserProfile(username);

		if (!data) {
			return {
				title: 'User Not Found',
			};
		}

		return {
			title: `${data.user.fullname}`,
			description: `View ${data.user.fullname}'s recipes and cooking profile on Savoury`,
		};
	} catch {
		return {
			title: 'Error Fetching User',
		};
	}
}

export default async function Profile({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const currentUser = await getCurrentUser();
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['profile', username],
		queryFn: () => user.fetchUserProfile(username),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProfilePage
				username={username}
				currentUserId={currentUser.user_id}
			/>
		</HydrationBoundary>
	);
}
