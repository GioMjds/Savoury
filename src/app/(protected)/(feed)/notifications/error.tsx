'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    return (
        <div className="max-w-4xl mx-auto p-4 pt-20">
            <div className="text-center p-12 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500" />
                    <FontAwesomeIcon icon={faBell} className="text-4xl text-gray-300" />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Failed to load notifications
                </h2>
                
                <p className="text-gray-600 mb-6">
                    Something went wrong while loading your notifications. Please try again.
                </p>
                
                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try again
                    </button>
                    
                    <p className="text-xs text-gray-500">
                        Error: {error.message}
                    </p>
                </div>
            </div>
        </div>
    );
}