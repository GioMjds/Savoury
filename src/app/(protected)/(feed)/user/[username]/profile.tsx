'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock,
    faUsers,
    faHeart,
    faComment,
    faBookmark,
    faUtensils,
    faEdit,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { user as userService } from '@/services/User';
import { formatCategory, formatDate, formatGender, formatTime } from '@/utils/formaters';
import { getSocialLinkInfo } from '@/utils/socialLinks';
import { UserProfileResponse } from '@/types/User';
import EditProfileModal from '@/components/EditProfileModal';

interface ProfileProps {
    username: string;
    currentUserId: number | null;
}

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
};

const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
};

export default function ProfilePage({ username, currentUserId }: ProfileProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    
    const { data } = useQuery<UserProfileResponse>({
        queryKey: ['profile', username],
        queryFn: () => userService.fetchUserProfile(username),
    });

    if (!data) return null;

    const { user: userProfile } = data;

    const isOwnProfile = String(currentUserId) === String(userProfile.user_id);

    return (
        <motion.div 
            className="min-h-screen mt-12 bg-background"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cover Photo & Profile Header */}
                <motion.div 
                    className="relative bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-6"
                    variants={fadeInUp}
                >
                    {/* Cover Photo */}
                    <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary-lighter to-primary-light overflow-hidden">
                        {userProfile.cover_photo ? (
                            <Image
                                src={userProfile.cover_photo}
                                alt={`${userProfile.fullname}'s cover`}
                                fill
                                priority
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-light/40 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUtensils} className="w-24 h-24 text-primary/30" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-6 pb-6">
                        {/* Profile Image - Overlapping the cover photo */}
                        <div className="flex justify-center sm:justify-start -mt-16 sm:-mt-20 mb-4">
                            <motion.div 
                                className="relative z-10"
                                variants={scaleIn}
                            >
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                                    <Image
                                        src={userProfile.profile_image}
                                        alt={`${userProfile.fullname}'s profile`}
                                        fill
                                        priority
                                        className="rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute inset-0 rounded-full ring-4 ring-primary/20" />
                                </div>
                            </motion.div>
                        </div>

                        {/* User Info - Positioned below cover photo */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50">
                            <div className="flex justify-between items-start mb-4">
                                <motion.div 
                                    variants={slideInLeft} 
                                    className="flex-1 min-w-0 pr-4"
                                >
                                    <div className="text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                                            <motion.h1 
                                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground truncate"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.2 }}
                                            >
                                                {userProfile.fullname}
                                            </motion.h1>

                                            {userProfile.gender && (
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.4, delay: 0.3 }}
                                                    className="text-primary"
                                                >
                                                    <FontAwesomeIcon icon={formatGender(userProfile.gender).icon as IconDefinition} color={formatGender(userProfile.gender).color} size="xl" />
                                                </motion.span>
                                            )}
                                        </div>

                                        <motion.div
                                            className="flex items-center justify-center sm:justify-start gap-2 mb-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        >
                                            <span className="text-lg sm:text-xl font-medium text-primary">
                                                @{userProfile.username}
                                            </span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                {/* Edit Profile Button */}
                                {isOwnProfile && (
                                    <motion.button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="group cursor-pointer relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0"
                                        whileHover={{  scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        variants={slideInLeft}
                                    >
                                        {/* Button background animation */}
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <FontAwesomeIcon 
                                            icon={faEdit} 
                                            className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-200" 
                                        />
                                        <span className="relative z-10">Edit</span>
                                    </motion.button>
                                )}
                            </div>

                            {/* Bio and Additional Info */}
                            <motion.div 
                                variants={slideInLeft}
                                className="space-y-4"
                            >
                                {userProfile.bio && (
                                    <motion.div
                                        className="relative p-4 rounded-2xl border border-muted/20"
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                                            {userProfile.bio}
                                        </p>
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl pointer-events-none" />
                                    </motion.div>
                                )}

                                {/* Enhanced Social Links */}
                                {userProfile.social_links && Object.keys(userProfile.social_links).length > 0 && (
                                    <motion.div 
                                        className="pt-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                    >
                                        <h3 className="text-sm font-semibold text-muted mb-3 tracking-wide uppercase">
                                            Connect With Me
                                        </h3>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {Object.entries(userProfile.social_links).map(([label, url]) => {
                                                const socialInfo = getSocialLinkInfo(url);
                                                
                                                return (
                                                    <motion.div
                                                        key={`${label}_${url}`}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 200 }}
                                                    >
                                                        <Link
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-muted/20 to-muted/10 hover:from-primary/20 hover:to-primary/10 text-muted hover:text-primary transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                                                        >
                                                            <FontAwesomeIcon 
                                                                icon={socialInfo.icon}
                                                                size='xl'
                                                                className="w-5 h-5 relative z-10" 
                                                            />
                                                        </Link>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar - Bookmarks */}
                    <motion.div 
                        className="lg:col-span-1"
                        variants={fadeInUp}
                    >
                        <div className="bg-white rounded-xl border border-border p-6 sticky top-20">
                            <div className="flex items-center gap-2 mb-4">
                                <FontAwesomeIcon icon={faBookmark} className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    Bookmarked Recipes
                                </h3>
                            </div>
                            
                            {userProfile.bookmarks?.length === 0 ? (
                                <div className="text-center py-8">
                                    <FontAwesomeIcon icon={faBookmark} className="w-12 h-12 text-muted mx-auto mb-3" />
                                    <p className="text-muted text-sm">No bookmarks yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {userProfile.bookmarks?.slice(0, 10).map((bookmark) => (
                                        <motion.div
                                            key={bookmark.bookmark_id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                        >
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                <Image
                                                    src={bookmark.recipe.image_url as string}
                                                    alt={bookmark.recipe.title}
                                                    fill
                                                    loading="lazy"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground text-sm line-clamp-1">
                                                    {bookmark.recipe.title}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    by @{bookmark.recipe.user.username}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Main Content - Recipes */}
                    <motion.div 
                        className="lg:col-span-2"
                        variants={fadeInUp}
                    >
                        <div className="bg-white rounded-xl border border-border p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">
                                    Recipes by {userProfile.fullname}
                                </h2>
                                <div className="text-sm text-muted">
                                    {userProfile.recipes.length} recipe{userProfile.recipes.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                            
                            {userProfile.recipes.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">👨‍🍳</div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        No recipes yet
                                    </h3>
                                    <p className="text-muted mx-auto">
                                        {userProfile.username} hasn't shared any recipes yet. 
                                        Check back later for delicious creations!
                                    </p>
                                    <Link href="/new" className='inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md'>
                                        Create Recipe
                                    </Link>
                                </div>
                            ) : (
                                <motion.div 
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                                    variants={staggerContainer}
                                >
                                    {userProfile.recipes.map((recipe) => (
                                        <Link
                                            href={`/recipe/${recipe.recipe_id}`}
                                            key={recipe.recipe_id}
                                            className="group border border-border rounded-lg overflow-hidden cursor-pointer bg-white"
                                        >
                                            <div className="relative h-48 bg-muted overflow-hidden">
                                                {recipe.image_url ? (
                                                    <Image
                                                        src={recipe.image_url}
                                                        alt={recipe.title}
                                                        fill
                                                        loading='lazy'
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    // Custom image fallback if no image has rendered
                                                    <Image 
                                                        src='/savoury-logo.png'
                                                        alt='Savoury Logo'
                                                        fill
                                                        priority
                                                        className="object-contain p-10 opacity-20"
                                                    />
                                                )}
                                                {recipe.category && (
                                                    <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                                                        {formatCategory(recipe.category)}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="p-4">
                                                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-lg">
                                                    {recipe.title}
                                                </h3>
                                                
                                                {recipe.description && (
                                                    <p className="text-sm text-muted mb-3 line-clamp-2">
                                                        {recipe.description}
                                                    </p>
                                                )}
                                                
                                                <div className="flex items-center justify-between text-xs text-muted mb-3">
                                                    <div className="flex items-center gap-3">
                                                        {recipe.prep_time_minutes && (
                                                            <div className="flex items-center gap-1">
                                                                <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                                                                <span>{formatTime(recipe.prep_time_minutes)}</span>
                                                            </div>
                                                        )}
                                                        {recipe.servings && (
                                                            <div className="flex items-center gap-1">
                                                                <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                                                                <span>{recipe.servings}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                                    <div className="flex items-center gap-4 text-xs text-muted">
                                                        <div className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faHeart} className="w-3 h-3" />
                                                            <span>{recipe.likes}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faComment} className="w-3 h-3" />
                                                            <span>{recipe._count?.comments}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faBookmark} className="w-3 h-3" />
                                                            <span>{recipe._count?.bookmarks}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted">
                                                        {formatDate(recipe.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    userProfile={userProfile}
                />
            )}
        </motion.div>
    );
}