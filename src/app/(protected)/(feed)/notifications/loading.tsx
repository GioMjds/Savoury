import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export default function LoadingNotifications() {
    return (
        <div className="max-w-5xl mx-auto p-4 pt-20 space-y-4">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faBell} className="text-2xl text-gray-300" />
                        <div className="space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
            </div>

            {/* Notifications Skeleton */}
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-start space-x-3">
                            {/* Avatar skeleton */}
                            <div className="relative">
                                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>

                            {/* Content skeleton */}
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                                
                                {/* Recipe card skeleton (random appearance) */}
                                {index % 3 === 0 && (
                                    <div className="mt-2 flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex justify-center items-center space-x-2 pt-6">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex space-x-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    );
}