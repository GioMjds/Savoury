'use client';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
            <div className="bg-error-light border border-[var(--color-error)] rounded-xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="flex flex-col items-center gap-4">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-error mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-error mb-2">Something went wrong</h2>
                    <p className="text-muted mb-4">{error.message || 'An unexpected error occurred.'}</p>
                    <button
                        onClick={reset}
                        className="bg-error text-white px-4 py-2 rounded-md shadow focus-ring hover:bg-[var(--color-error)]/90 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}