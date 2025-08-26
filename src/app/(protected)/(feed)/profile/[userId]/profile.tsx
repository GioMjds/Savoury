'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { user as userService } from '@/services/User';
import type { UserProfileResponse } from '@/types/User';
import { formatDate, formatTime } from '@/utils/formaters';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ProfilePage({ userId }: { userId: number }) {
    const { data } = useQuery<UserProfileResponse>({
        queryKey: ['profile', userId],
        queryFn: () => userService.fetchUserProfile(userId),
    });

    const totalRecipes = data?.user.recipes?.length;
    const totalComments = data?.user.comments?.length;
    const totalRatings = data?.user.ratings?.length;

    return (
        <motion.div 
            className="min-h-screen mt-12 bg-background py-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <motion.div 
                    className="bg-white rounded-xl shadow-sm border border-border p-6 mb-6"
                    variants={fadeInUp}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            <Image
                                src={data?.user?.profile_image as string}
                                alt={`${data?.user?.fullname}'s profile`}
                                width={120}
                                height={120}
                                className="rounded-full object-cover border-4 border-primary-light"
                                priority
                            />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                {data?.user?.fullname}
                            </h1>
                            <p className="text-lg text-primary mb-2">
                                @{data?.user?.username}
                            </p>
                            <p className="text-sm text-muted">
                                Member since {formatDate(data?.user?.created_at as string)}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                    variants={fadeInUp}
                >
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-border text-center">
                        <div className="text-2xl font-bold text-primary">{totalRecipes}</div>
                        <div className="text-sm text-muted">Recipes</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-border text-center">
                        <div className="text-2xl font-bold text-primary">{totalComments}</div>
                        <div className="text-sm text-muted">Comments</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-border text-center">
                        <div className="text-2xl font-bold text-primary">{totalRatings}</div>
                        <div className="text-sm text-muted">Ratings Given</div>
                    </div>
                </motion.div>

                {/* User's Recipes */}
                <motion.div 
                    className="bg-white rounded-xl shadow-sm border border-border p-6"
                    variants={fadeInUp}
                >
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Recipes by {data?.user.fullname}
                    </h2>
                    
                    {totalRecipes === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">👨‍🍳</div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                No recipes yet
                            </h3>
                            <p className="text-muted">
                                {data?.user.fullname} hasn't shared any recipes yet.
                            </p>
                        </div>
                    ) : (
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={staggerContainer}
                        >
                            {data?.user?.recipes.map((recipe) => (
                                <motion.div
                                    key={recipe.recipe_id}
                                    className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                    variants={fadeInUp}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="relative h-48 bg-muted">
                                        {recipe.image_url ? (
                                            <Image
                                                src={recipe.image_url}
                                                alt={recipe.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-6xl">
                                                🍽️
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                                            {recipe.title}
                                        </h3>
                                        {recipe.description && (
                                            <p className="text-sm text-muted mb-3 line-clamp-2">
                                                {recipe.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-muted">
                                            <div className="flex items-center gap-2">
                                                <span>⏱️ {formatTime(recipe.prep_time_minutes)}</span>
                                                <span>🍽️ {recipe.servings}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span>⭐</span>
                                                <span>{Number(recipe.average_rating).toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}