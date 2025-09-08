import { Metadata } from 'next';
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { feed } from '@/services/Feed';
import SearchResultsPage from './search-results';

export const metadata: Metadata = {
	title: 'Search',
	description: 'Search results here...',
};

export default async function Search({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>
}) {
	const params = await searchParams;
	const queryClient = new QueryClient();
	const query = params?.q?.trim() || '';

	if (query) {
		await queryClient.prefetchQuery({
			queryKey: ['search', query],
			queryFn: () => feed.searchRecipePost(query),
		});
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SearchResultsPage />
		</HydrationBoundary>
	);
}
