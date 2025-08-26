
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Skeleton circle height={120} width={120} />
                        <div className="flex-1 text-center sm:text-left">
                            <Skeleton height={32} width={200} className="mb-2" />
                            <Skeleton height={20} width={150} className="mb-2" />
                            <Skeleton height={16} width={100} />
                        </div>
                    </div>
                </div>
                
                {/* Stats skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-[var(--color-border)]">
                            <Skeleton height={24} width={60} className="mb-2" />
                            <Skeleton height={16} width={80} />
                        </div>
                    ))}
                </div>
                
                {/* Recipes skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                    <Skeleton height={24} width={120} className="mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                                <Skeleton height={200} />
                                <div className="p-4">
                                    <Skeleton height={20} className="mb-2" />
                                    <Skeleton height={16} width="60%" className="mb-2" />
                                    <Skeleton height={14} width="40%" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}