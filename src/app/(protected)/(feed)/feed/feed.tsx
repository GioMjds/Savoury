'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { feed, type FeedRecipe } from '@/services/Feed';
import PostBlock from '@/components/PostBlock';

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring' as const,
			stiffness: 100,
			damping: 15,
		},
	},
};

const FeedPage = () => {
	const { data: feedData } = useQuery({
		queryKey: ['feed'],
		queryFn: feed.fetchFeed,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10, 
	});

	const recipes = feedData?.feed || [];

	return (
		<div className="min-h-screen bg-background pt-20 pb-8">
			<div className="container mx-auto px-4 lg:px-8">
				{/* Feed Content */}
				<AnimatePresence mode="wait">
					{recipes.length === 0 ? (
						<motion.div
							key="empty-state"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
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
								<div className="space-y-2">
									<motion.div
										whileHover={{ scale: 1.02 }}
										className="bg-primary-light/20 text-primary p-3 rounded-lg text-sm"
									>
										💡 Tip: Check out our trending recipes in the explore section
									</motion.div>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="feed-grid"
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{recipes.map((recipe: FeedRecipe) => (
								<motion.div key={recipe.recipe_id} variants={itemVariants}>
									<PostBlock recipe={recipe} />
								</motion.div>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default FeedPage;