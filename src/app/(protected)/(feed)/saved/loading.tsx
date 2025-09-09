'use client';

import { motion } from 'motion/react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Skeleton */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <Skeleton height={36} width={300} className="mx-auto mb-4" />
                    <Skeleton height={20} width={200} className="mx-auto" />
                </motion.div>

                {/* Filter Skeleton */}
                <div className="mb-8 flex flex-wrap gap-2 justify-center">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height={36} width={100} />
                    ))}
                </div>

                {/* Recipe Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <Skeleton height={192} className="w-full" />
                            <div className="p-4">
                                <Skeleton height={24} className="mb-2" />
                                <Skeleton count={2} className="mb-4" />
                                <div className="flex items-center text-sm text-muted mb-4">
                                    <Skeleton width={120} />
                                    <Skeleton width={80} className="ml-3" />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <Skeleton width={80} />
                                    <Skeleton width={80} />
                                </div>
                            </div>
                            <div className="px-4 pb-4">
                                <Skeleton height={16} width={120} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}