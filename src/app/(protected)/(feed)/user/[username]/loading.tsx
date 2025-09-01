'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';

const skeletonCards = Array.from({ length: 4 }, (_, i) => i);
const bookmarkItems = Array.from({ length: 4 }, (_, i) => i);

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

const cardVariants = {
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
            duration: 0.6,
        },
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

export default function Loading() {
    return (
        <motion.div 
            className="min-h-screen mt-12 bg-background"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cover Photo & Profile Header */}
                <motion.div 
                    className="relative bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-6"
                    variants={fadeInUp}
                >
                    {/* Cover Photo Skeleton */}
                    <div className="relative h-48 sm:h-64 overflow-hidden">
                        <Skeleton 
                            height="100%" 
                            width="100%" 
                            baseColor="#f3f4f6" 
                            highlightColor="#e5e7eb"
                            className="absolute inset-0"
                        />
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-6 pb-6">
                        {/* Profile Image - Overlapping the cover photo */}
                        <div className="flex justify-center sm:justify-start -mt-16 sm:-mt-20 mb-4">
                            <div className="relative z-10">
                                <Skeleton 
                                    circle 
                                    height={128} 
                                    width={128} 
                                    baseColor="#ffffff" 
                                    highlightColor="#f9fafb"
                                    className="sm:w-40 sm:h-40 border-4 border-white shadow-lg"
                                />
                            </div>
                        </div>

                        {/* User Info - Positioned below cover photo */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                                            {/* Name Skeleton */}
                                            <Skeleton 
                                                height={48} 
                                                width={280} 
                                                baseColor="#f3f4f6" 
                                                highlightColor="#e5e7eb"
                                                className="text-3xl sm:text-4xl lg:text-5xl"
                                            />
                                            {/* Gender Icon Skeleton */}
                                            <Skeleton 
                                                circle 
                                                height={24} 
                                                width={24} 
                                                baseColor="#f3f4f6" 
                                                highlightColor="#e5e7eb"
                                            />
                                        </div>

                                        {/* Username Skeleton */}
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                                            <Skeleton 
                                                height={24} 
                                                width={150} 
                                                baseColor="#f3f4f6" 
                                                highlightColor="#e5e7eb"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Edit Profile Button Skeleton */}
                                <Skeleton 
                                    height={44} 
                                    width={100} 
                                    borderRadius={12}
                                    baseColor="#f3f4f6" 
                                    highlightColor="#e5e7eb"
                                />
                            </div>

                            {/* Bio and Additional Info */}
                            <div className="space-y-4">
                                {/* Bio Skeleton */}
                                <div className="p-4 rounded-2xl border border-muted/20">
                                    <Skeleton 
                                        height={16} 
                                        width="100%" 
                                        baseColor="#f9fafb" 
                                        highlightColor="#f3f4f6"
                                        className="mb-2"
                                    />
                                    <Skeleton 
                                        height={16} 
                                        width="80%" 
                                        baseColor="#f9fafb" 
                                        highlightColor="#f3f4f6"
                                        className="mb-2"
                                    />
                                    <Skeleton 
                                        height={16} 
                                        width="60%" 
                                        baseColor="#f9fafb" 
                                        highlightColor="#f3f4f6"
                                    />
                                </div>

                                {/* Social Links Skeleton */}
                                <div className="pt-2">
                                    <Skeleton 
                                        height={14} 
                                        width={120} 
                                        baseColor="#f3f4f6" 
                                        highlightColor="#e5e7eb"
                                        className="mb-3"
                                    />
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {[...Array(3)].map((_, i) => (
                                            <Skeleton 
                                                key={i}
                                                height={48} 
                                                width={48} 
                                                borderRadius={16}
                                                baseColor="#f3f4f6" 
                                                highlightColor="#e5e7eb"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar - Bookmarks Skeleton */}
                    <motion.div 
                        className="lg:col-span-1"
                        variants={fadeInUp}
                    >
                        <div className="bg-white rounded-xl border border-border p-6 sticky top-20">
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton 
                                    circle 
                                    height={20} 
                                    width={20} 
                                    baseColor="#f3f4f6" 
                                    highlightColor="#e5e7eb"
                                />
                                <Skeleton 
                                    height={20} 
                                    width={140} 
                                    baseColor="#f3f4f6" 
                                    highlightColor="#e5e7eb"
                                />
                            </div>
                            
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {bookmarkItems.map((index) => (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        className="flex items-center gap-3 p-2 rounded-lg"
                                    >
                                        <Skeleton 
                                            height={48} 
                                            width={48} 
                                            borderRadius={8}
                                            baseColor="#f3f4f6" 
                                            highlightColor="#e5e7eb"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <Skeleton 
                                                height={14} 
                                                width="80%" 
                                                baseColor="#f9fafb" 
                                                highlightColor="#f3f4f6"
                                                className="mb-1"
                                            />
                                            <Skeleton 
                                                height={12} 
                                                width="60%" 
                                                baseColor="#f9fafb" 
                                                highlightColor="#f3f4f6"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content - Recipes Skeleton */}
                    <motion.div 
                        className="lg:col-span-2"
                        variants={fadeInUp}
                    >
                        <div className="bg-white rounded-xl border border-border p-6">
                            <div className="flex items-center justify-between mb-6">
                                <Skeleton 
                                    height={32} 
                                    width={220} 
                                    baseColor="#f3f4f6" 
                                    highlightColor="#e5e7eb"
                                />
                                <Skeleton 
                                    height={16} 
                                    width={80} 
                                    baseColor="#f9fafb" 
                                    highlightColor="#f3f4f6"
                                />
                            </div>
                            
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {skeletonCards.map((index) => (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        className="border border-border rounded-lg overflow-hidden bg-white"
                                    >
                                        {/* Recipe Image Skeleton */}
                                        <div className="relative h-48">
                                            <Skeleton 
                                                height="100%" 
                                                width="100%" 
                                                baseColor="#f3f4f6" 
                                                highlightColor="#e5e7eb"
                                                className="absolute inset-0"
                                            />
                                            {/* Category Badge Skeleton */}
                                            <div className="absolute top-3 left-3">
                                                <Skeleton 
                                                    height={24} 
                                                    width={80} 
                                                    borderRadius={12}
                                                    baseColor="#ffffff" 
                                                    highlightColor="#f9fafb"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="p-4">
                                            {/* Recipe Title */}
                                            <Skeleton 
                                                height={24} 
                                                width="90%" 
                                                baseColor="#f3f4f6" 
                                                highlightColor="#e5e7eb"
                                                className="mb-2"
                                            />
                                            
                                            {/* Recipe Description */}
                                            <div className="mb-3">
                                                <Skeleton 
                                                    height={16} 
                                                    width="100%" 
                                                    baseColor="#f9fafb" 
                                                    highlightColor="#f3f4f6"
                                                    className="mb-1"
                                                />
                                                <Skeleton 
                                                    height={16} 
                                                    width="70%" 
                                                    baseColor="#f9fafb" 
                                                    highlightColor="#f3f4f6"
                                                />
                                            </div>
                                            
                                            {/* Recipe Meta Info */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Skeleton 
                                                            circle 
                                                            height={12} 
                                                            width={12} 
                                                            baseColor="#f3f4f6" 
                                                            highlightColor="#e5e7eb"
                                                        />
                                                        <Skeleton 
                                                            height={12} 
                                                            width={40} 
                                                            baseColor="#f9fafb" 
                                                            highlightColor="#f3f4f6"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Skeleton 
                                                            circle 
                                                            height={12} 
                                                            width={12} 
                                                            baseColor="#f3f4f6" 
                                                            highlightColor="#e5e7eb"
                                                        />
                                                        <Skeleton 
                                                            height={12} 
                                                            width={20} 
                                                            baseColor="#f9fafb" 
                                                            highlightColor="#f3f4f6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Skeleton 
                                                        circle 
                                                        height={12} 
                                                        width={12} 
                                                        baseColor="#f3f4f6" 
                                                        highlightColor="#e5e7eb"
                                                    />
                                                    <Skeleton 
                                                        height={12} 
                                                        width={30} 
                                                        baseColor="#f9fafb" 
                                                        highlightColor="#f3f4f6"
                                                    />
                                                </div>
                                            </div>

                                            {/* Recipe Stats */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                                <div className="flex items-center gap-4">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="flex items-center gap-1">
                                                            <Skeleton 
                                                                circle 
                                                                height={12} 
                                                                width={12} 
                                                                baseColor="#f3f4f6" 
                                                                highlightColor="#e5e7eb"
                                                            />
                                                            <Skeleton 
                                                                height={12} 
                                                                width={20} 
                                                                baseColor="#f9fafb" 
                                                                highlightColor="#f3f4f6"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <Skeleton 
                                                    height={12} 
                                                    width={60} 
                                                    baseColor="#f9fafb" 
                                                    highlightColor="#f3f4f6"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Loading Tip */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <div className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            👨‍🍳
                        </motion.div>
                        <span className="font-medium">
                            Loading profile data...
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}