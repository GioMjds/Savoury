'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { feed } from '@/services/Feed';
import PostBlock from '@/components/PostBlock';
import { FeedRecipe, FeedResponse } from '@/types/FeedResponse';
import Image from 'next/image';

const fadeIn = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	transition: { duration: 0.3 },
};

interface FeedPageProps {
	currentUserId: number;
	currentUser: {
		user_id: number;
		profile_image: string;
		fullname: string;
		username: string;
	};
}

export default function FeedPage({ currentUserId, currentUser }: FeedPageProps) {
	const { data: feedData } = useQuery<FeedResponse>({
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
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Main Feed Content - 2/3 width */}
					<div className="w-full lg:w-2/3">
						{recipes.length === 0 ? (
							<motion.div
								{...fadeIn}
								className="text-center py-16"
							>
								<div className="max-w-3xl mx-auto">
									<Image 
										src="/savoury-logo.png"
										alt='Savoury Logo'
										width={130}
										height={130}
										className="mx-auto mb-4"
										priority
									/>
									<h3 className="text-xl font-semibold text-foreground mb-2">
										No recipes yet
									</h3>
									<p className="text-muted mb-6">
										Your feed is looking a bit empty. Start
										following some creators to see their
										amazing recipes here!
									</p>
									<div className="bg-primary-light/20 text-primary p-3 rounded-lg text-sm">
										💡 Tip: Check out our trending recipes in the explore section
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div {...fadeIn} className="space-y-4">
								{recipes.map((recipe: FeedRecipe) => (
									<div
										key={recipe.recipe_id}
										className="w-3xl"
									>
										<div className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
											<PostBlock recipe={recipe} currentUserId={currentUserId} currentUser={currentUser} />
										</div>
									</div>
								))}
							</motion.div>
						)}
					</div>

					{/* Sidebar - 1/3 width, hidden on mobile */}
					<motion.div {...fadeIn} className="w-full lg:w-1/3 hidden lg:block">
						<div className="sticky top-24 space-y-6">
							{/* Footer Links */}
							<div className="text-sm text-center text-muted space-y-2">
								<p className="pt-2">
									&copy; {new Date().getFullYear()} Savoury | All rights reserved.
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
