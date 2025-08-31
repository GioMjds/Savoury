'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { feed, type FeedRecipe } from '@/services/Feed';
import PostBlock from '@/components/PostBlock';

const fadeIn = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	transition: { duration: 0.3 }
};

export default function FeedPage() {
	const { data: feedData } = useQuery({
		queryKey: ['feed'],
		queryFn: feed.fetchFeed,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
	});

	const recipes = feedData?.feed || [];

	return (
		<div className="min-h-screen bg-background pt-20 pb-8">
			<div className="container mx-auto px-4 lg:px-8">
				{/* Feed Content */}
				{recipes.length === 0 ? (
					<motion.div
						{...fadeIn}
						className="text-center py-16"
					>
						<div className="max-w-md mx-auto">
							<div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-4xl">🍽️</span>
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">
								No recipes yet
							</h3>
							<p className="text-muted mb-6">
								Your feed is looking a bit empty. Start following some creators to see their amazing recipes here!
							</p>
							<div className="bg-primary-light/20 text-primary p-3 rounded-lg text-sm">
								💡 Tip: Check out our trending recipes in the explore section
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						{...fadeIn}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{recipes.map((recipe: FeedRecipe) => (
							<PostBlock key={recipe.recipe_id} recipe={recipe} />
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
};
